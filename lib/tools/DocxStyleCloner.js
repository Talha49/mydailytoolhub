import JSZip from 'jszip';

/**
 * Helper to get elements by their local tag name (ignoring namespaces)
 */
function getElementsByLocalName(dom, localName) {
  const elements = dom.getElementsByTagName('*');
  const results = [];
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].localName === localName) {
      results.push(elements[i]);
    }
  }
  return results;
}

/**
 * Helper to get a single element by its local tag name (ignoring namespaces)
 */
function getElementByLocalName(dom, localName) {
  const elements = dom.getElementsByTagName('*');
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].localName === localName) {
      return elements[i];
    }
  }
  return null;
}

/**
 * Helper to determine if a paragraph is empty (contains no text or elements like images)
 */
function isParagraphEmpty(pNode) {
  // Check for any text content
  const texts = getElementsByLocalName(pNode, 't');
  for (let i = 0; i < texts.length; i++) {
    if (texts[i].textContent.replace(/\s/g, '').length > 0) {
      return false;
    }
  }
  
  // Check for elements that represent content or layouts (drawings, images, page breaks, etc.)
  if (
    getElementsByLocalName(pNode, 'drawing').length > 0 ||
    getElementsByLocalName(pNode, 'pict').length > 0 ||
    getElementsByLocalName(pNode, 'br').length > 0 ||
    getElementsByLocalName(pNode, 'cr').length > 0 ||
    getElementsByLocalName(pNode, 'sym').length > 0 ||
    getElementsByLocalName(pNode, 'tbl').length > 0
  ) {
    return false;
  }
  
  return true;
}

/**
 * Process a group of consecutive empty paragraphs to convert them to structured layout
 */
function processEmptyParagraphGroup(emptyGroup, dom, spacingAfterDefault = 120) {
  if (emptyGroup.length === 0) return;

  const parent = emptyGroup[0].parentNode;
  if (!parent) return;

  // 1. If 4 or more empty paragraphs, replace them all with a single clean Page Break
  if (emptyGroup.length >= 4) {
    const pBreak = dom.createElementNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'w:p');
    
    // Create paragraph properties
    const pPr = dom.createElementNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'w:pPr');
    pBreak.appendChild(pPr);
    
    // Create run with page break
    const rBreak = dom.createElementNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'w:r');
    const brNode = dom.createElementNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'w:br');
    brNode.setAttribute('w:type', 'page');
    
    rBreak.appendChild(brNode);
    pBreak.appendChild(rBreak);
    
    parent.insertBefore(pBreak, emptyGroup[0]);
  } 
  // 2. If 1-3 empty paragraphs, convert them into bottom spacing on the preceding paragraph
  else {
    const prevP = emptyGroup[0].previousSibling;
    if (prevP && prevP.nodeType === 1 && prevP.localName === 'p') {
      let pPr = getElementByLocalName(prevP, 'pPr');
      if (!pPr) {
        pPr = dom.createElementNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'w:pPr');
        prevP.insertBefore(pPr, prevP.firstChild);
      }
      
      let spacing = getElementByLocalName(pPr, 'spacing');
      if (!spacing) {
        spacing = dom.createElementNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'w:spacing');
        pPr.appendChild(spacing);
      }
      
      // Accumulate spacing: 1 empty line = 180 twips, 2 lines = 360 twips, etc.
      const currentAfter = parseInt(spacing.getAttribute('w:after') || '0', 10);
      const addedSpacing = emptyGroup.length * 180;
      spacing.setAttribute('w:after', (currentAfter + addedSpacing).toString());
    }
  }

  // Remove the actual empty paragraphs from the DOM
  for (let i = 0; i < emptyGroup.length; i++) {
    if (emptyGroup[i].parentNode) {
      emptyGroup[i].parentNode.removeChild(emptyGroup[i]);
    }
  }
}

/**
 * Extracts design, layout, and style metadata from a DOCX file buffer.
 * Returns information to render the visual "Brand Guideline Card".
 */
export async function extractDocxMetadata(fileBuffer) {
  const zip = await JSZip.loadAsync(fileBuffer);
  
  const metadata = {
    fonts: { heading: 'Unknown Font', body: 'Unknown Font' },
    colors: [],
    margins: { top: 1, bottom: 1, left: 1, right: 1 },
    pageSize: 'Letter',
    hasStyles: false,
    hasTheme: false
  };

  // 1. Parse Theme XML (Fonts & Color Scheme)
  const themeFile = zip.file('word/theme/theme1.xml');
  if (themeFile) {
    try {
      metadata.hasTheme = true;
      const themeText = await themeFile.async('text');
      const parser = new DOMParser();
      const themeDoc = parser.parseFromString(themeText, 'application/xml');
      
      // Extract Fonts
      const majorFonts = getElementsByLocalName(themeDoc, 'majorFont');
      if (majorFonts.length > 0) {
        const latinFont = getElementByLocalName(majorFonts[0], 'latin');
        if (latinFont && latinFont.getAttribute('typeface')) {
          metadata.fonts.heading = latinFont.getAttribute('typeface');
        }
      }

      const minorFonts = getElementsByLocalName(themeDoc, 'minorFont');
      if (minorFonts.length > 0) {
        const latinFont = getElementByLocalName(minorFonts[0], 'latin');
        if (latinFont && latinFont.getAttribute('typeface')) {
          metadata.fonts.body = latinFont.getAttribute('typeface');
        }
      }

      // Extract Theme Colors
      const clrScheme = getElementByLocalName(themeDoc, 'clrScheme');
      if (clrScheme) {
        const srgbColors = clrScheme.getElementsByTagNameNS('*', 'srgbClr');
        const hexColors = new Set();
        for (let i = 0; i < srgbColors.length; i++) {
          const val = srgbColors[i].getAttribute('val');
          if (val && val.length === 6) {
            hexColors.add('#' + val.toUpperCase());
          }
        }
        metadata.colors = Array.from(hexColors);
      }
    } catch (e) {
      console.warn('Failed parsing theme1.xml for metadata', e);
    }
  }

  // 2. Parse Styles XML (Fallback Fonts & Heading Colors)
  const stylesFile = zip.file('word/styles.xml');
  if (stylesFile) {
    metadata.hasStyles = true;
    try {
      const stylesText = await stylesFile.async('text');
      const parser = new DOMParser();
      const stylesDoc = parser.parseFromString(stylesText, 'application/xml');
      
      // Extract fonts if not found in theme
      if (metadata.fonts.heading === 'Unknown Font' || metadata.fonts.body === 'Unknown Font') {
        const rFonts = getElementsByLocalName(stylesDoc, 'rFonts');
        for (let i = 0; i < rFonts.length; i++) {
          const font = rFonts[i].getAttribute('w:ascii') || rFonts[i].getAttribute('ascii');
          if (font) {
            if (metadata.fonts.body === 'Unknown Font') {
              metadata.fonts.body = font;
            } else if (metadata.fonts.heading === 'Unknown Font') {
              metadata.fonts.heading = font;
            }
          }
        }
      }

      // Find other unique colors inside the style sheets
      const colors = getElementsByLocalName(stylesDoc, 'color');
      const extraColors = new Set(metadata.colors);
      for (let i = 0; i < colors.length; i++) {
        const val = colors[i].getAttribute('w:val') || colors[i].getAttribute('val');
        if (val && val.length === 6 && val !== 'auto') {
          extraColors.add('#' + val.toUpperCase());
        }
      }
      metadata.colors = Array.from(extraColors).slice(0, 8); // Keep top 8 colors
    } catch (e) {
      console.warn('Failed parsing styles.xml for metadata', e);
    }
  }

  // 3. Parse Document XML (Margins & Page Size)
  const docFile = zip.file('word/document.xml');
  if (docFile) {
    try {
      const docText = await docFile.async('text');
      const parser = new DOMParser();
      const docDOM = parser.parseFromString(docText, 'application/xml');
      
      const bodyNode = getElementByLocalName(docDOM, 'body');
      if (bodyNode) {
        const sectPr = getElementByLocalName(bodyNode, 'sectPr');
        if (sectPr) {
          // Margins
          const pgMar = getElementByLocalName(sectPr, 'pgMar');
          if (pgMar) {
            const top = parseInt(pgMar.getAttribute('w:top') || pgMar.getAttribute('top') || '1440', 10);
            const bottom = parseInt(pgMar.getAttribute('w:bottom') || pgMar.getAttribute('bottom') || '1440', 10);
            const left = parseInt(pgMar.getAttribute('w:left') || pgMar.getAttribute('left') || '1440', 10);
            const right = parseInt(pgMar.getAttribute('w:right') || pgMar.getAttribute('right') || '1440', 10);
            
            // 1440 Twips = 1 Inch
            metadata.margins = {
              top: parseFloat((top / 1440).toFixed(2)),
              bottom: parseFloat((bottom / 1440).toFixed(2)),
              left: parseFloat((left / 1440).toFixed(2)),
              right: parseFloat((right / 1440).toFixed(2))
            };
          }
          
          // Page size
          const pgSz = getElementByLocalName(sectPr, 'pgSz');
          if (pgSz) {
            const w = parseInt(pgSz.getAttribute('w:w') || pgSz.getAttribute('w') || '12240', 10);
            const h = parseInt(pgSz.getAttribute('w:h') || pgSz.getAttribute('h') || '15840', 10);
            
            // Detect common sizes
            if (w === 12240 && h === 15840) {
              metadata.pageSize = 'Letter (8.5" x 11")';
            } else if (w === 11906 && h === 16838) {
              metadata.pageSize = 'A4 (8.27" x 11.69")';
            } else if (w === 12240 && h === 20160) {
              metadata.pageSize = 'Legal (8.5" x 14")';
            } else {
              metadata.pageSize = `Custom (${(w / 1440).toFixed(1)}" x ${(h / 1440).toFixed(1)}")`;
            }
          }
        }
      }
    } catch (e) {
      console.warn('Failed parsing document.xml for layout metadata', e);
    }
  }

  return metadata;
}

/**
 * Clones styles and layout configuration from a template DOCX into a target DOCX.
 * Returns a Promise resolving to the newly compiled DOCX blob.
 */
export async function cloneDocxStyles(templateBuffer, targetBuffer, options = {}) {
  const {
    copyStyles = true,
    copyLayout = true,
    stripDirectFormatting = true,
    copyHeadersFooters = false,
    cleanEmptyReturns = true,
    standardizeTables = true,
    normalizeSpacing = true,
    primaryBrandColor = ''
  } = options;

  const templateZip = await JSZip.loadAsync(templateBuffer);
  const targetZip = await JSZip.loadAsync(targetBuffer);

  const parser = new DOMParser();

  // 1. Copy styles.xml (Main document styles)
  if (copyStyles) {
    const templateStyles = templateZip.file('word/styles.xml');
    if (templateStyles) {
      const stylesText = await templateStyles.async('text');
      targetZip.file('word/styles.xml', stylesText);
    }

    // Copy theme1.xml
    const templateTheme = templateZip.file('word/theme/theme1.xml');
    if (templateTheme) {
      const themeText = await templateTheme.async('text');
      targetZip.file('word/theme/theme1.xml', themeText);
    }

    // Copy numbering.xml (Lists & numbering styles)
    const templateNumbering = templateZip.file('word/numbering.xml');
    if (templateNumbering) {
      const numberingText = await templateNumbering.async('text');
      targetZip.file('word/numbering.xml', numberingText);
    }

    // Copy fontTable.xml
    const templateFontTable = templateZip.file('word/fontTable.xml');
    if (templateFontTable) {
      const fontTableText = await templateFontTable.async('text');
      targetZip.file('word/fontTable.xml', fontTableText);
    }
  }

  // 2. Fetch template metadata colors for shading tables
  const meta = await extractDocxMetadata(templateBuffer);

  // 3. Process Target's word/document.xml
  const targetDocFile = targetZip.file('word/document.xml');
  if (targetDocFile) {
    const targetDocXml = await targetDocFile.async('text');
    const targetDOM = parser.parseFromString(targetDocXml, 'application/xml');

    // A. Copy Page Margins and layout
    if (copyLayout) {
      const templateDocFile = templateZip.file('word/document.xml');
      if (templateDocFile) {
        const templateDocXml = await templateDocFile.async('text');
        const templateDOM = parser.parseFromString(templateDocXml, 'application/xml');
        
        const templateBody = getElementByLocalName(templateDOM, 'body');
        const targetBody = getElementByLocalName(targetDOM, 'body');
        
        if (templateBody && targetBody) {
          const templateSectPr = getElementByLocalName(templateBody, 'sectPr');
          const targetSectPr = getElementByLocalName(targetBody, 'sectPr');
          
          if (templateSectPr && targetSectPr) {
            // Import the template's sectPr node into target document
            const importedSectPr = targetDOM.importNode(templateSectPr, true);
            
            // If we are NOT copying headers and footers, we should preserve the target's existing header/footer references inside sectPr
            if (!copyHeadersFooters) {
              const headerRefs = getElementsByLocalName(importedSectPr, 'headerReference');
              for (let i = headerRefs.length - 1; i >= 0; i--) {
                headerRefs[i].parentNode.removeChild(headerRefs[i]);
              }
              const footerRefs = getElementsByLocalName(importedSectPr, 'footerReference');
              for (let i = footerRefs.length - 1; i >= 0; i--) {
                footerRefs[i].parentNode.removeChild(footerRefs[i]);
              }
              
              const targetHeaderRefs = getElementsByLocalName(targetSectPr, 'headerReference');
              for (let i = 0; i < targetHeaderRefs.length; i++) {
                importedSectPr.appendChild(targetDOM.importNode(targetHeaderRefs[i], true));
              }
              const targetFooterRefs = getElementsByLocalName(targetSectPr, 'footerReference');
              for (let i = 0; i < targetFooterRefs.length; i++) {
                importedSectPr.appendChild(targetDOM.importNode(targetFooterRefs[i], true));
              }
            }
            
            targetBody.replaceChild(importedSectPr, targetSectPr);
          }
        }
      }
    }

    // B. Strip Manual Direct Formatting overrides (colors, sizes, fonts in text runs)
    if (stripDirectFormatting) {
      // 1. Clean Run Properties overrides
      const rPrs = getElementsByLocalName(targetDOM, 'rPr');
      for (let i = 0; i < rPrs.length; i++) {
        const rPr = rPrs[i];
        const children = rPr.childNodes;
        for (let j = children.length - 1; j >= 0; j--) {
          const child = children[j];
          if (child.nodeType === 1) { // ELEMENT_NODE
            const localName = child.localName;
            if (localName === 'color' || localName === 'sz' || localName === 'szCs' || localName === 'rFonts') {
              rPr.removeChild(child);
            }
          }
        }
      }

      // 2. Clean Paragraph Properties overrides (manual alignment, manual spacing offsets)
      const pPrs = getElementsByLocalName(targetDOM, 'pPr');
      for (let i = 0; i < pPrs.length; i++) {
        const pPr = pPrs[i];
        const children = pPr.childNodes;
        for (let j = children.length - 1; j >= 0; j--) {
          const child = children[j];
          if (child.nodeType === 1) {
            const localName = child.localName;
            // Strip manual indentation, spacing heights, and manual paragraph border overrides
            if (localName === 'ind' || localName === 'pBorders' || localName === 'shd') {
              pPr.removeChild(child);
            }
          }
        }
      }
    }

    // C. Clean Consecutive Return keys (empty paragraphs)
    if (cleanEmptyReturns) {
      const bodyNode = getElementByLocalName(targetDOM, 'body');
      if (bodyNode) {
        const children = Array.from(bodyNode.childNodes);
        let emptyGroup = [];
        
        for (let i = 0; i < children.length; i++) {
          const node = children[i];
          if (node.nodeType === 1 && node.localName === 'p') {
            if (isParagraphEmpty(node)) {
              emptyGroup.push(node);
            } else {
              if (emptyGroup.length > 0) {
                processEmptyParagraphGroup(emptyGroup, targetDOM);
                emptyGroup = [];
              }
            }
          } else if (node.nodeType === 1) {
            // Found a table or section break, clear active empty group
            if (emptyGroup.length > 0) {
              processEmptyParagraphGroup(emptyGroup, targetDOM);
              emptyGroup = [];
            }
          }
        }
        
        // Process final trailing group
        if (emptyGroup.length > 0) {
          processEmptyParagraphGroup(emptyGroup, targetDOM);
        }
      }
    }

    // D. Normalize multiple consecutive spacing
    if (normalizeSpacing) {
      const texts = getElementsByLocalName(targetDOM, 't');
      for (let i = 0; i < texts.length; i++) {
        const t = texts[i];
        if (t.textContent) {
          // Replace multiple spaces with a single space
          t.textContent = t.textContent.replace(/ {2,}/g, ' ');
        }
      }
    }

    // E. Standardize table styling and layout templates
    if (standardizeTables) {
      // 1. Attempt to extract template table design settings
      let templateTblPr = null;
      const templateDocFile = templateZip.file('word/document.xml');
      if (templateDocFile) {
        try {
          const templateDocXml = await templateDocFile.async('text');
          const templateDocDOM = parser.parseFromString(templateDocXml, 'application/xml');
          const templateTables = getElementsByLocalName(templateDocDOM, 'tbl');
          if (templateTables.length > 0) {
            const firstTbl = templateTables[0];
            const tblPr = getElementByLocalName(firstTbl, 'tblPr');
            if (tblPr) {
              templateTblPr = tblPr.cloneNode(true);
            }
          }
        } catch (e) {
          console.warn('Failed extracting template table properties', e);
        }
      }

      // Fallback table formatting if template has no tables in body
      if (!templateTblPr) {
        try {
          const mockDOM = parser.parseFromString(`
            <w:tblPr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
              <w:tblStyle w:val="TableGrid"/>
              <w:tblW w:w="0" w:type="auto"/>
              <w:tblBorders>
                <w:top w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
                <w:left w:val="none"/>
                <w:bottom w:val="single" w:sz="8" w:space="0" w:color="666666"/>
                <w:right w:val="none"/>
                <w:insideH w:val="single" w:sz="4" w:space="0" w:color="E5E7EB"/>
                <w:insideV w:val="none"/>
              </w:tblBorders>
              <w:tblCellMar>
                <w:top w:w="120" w:type="dxa"/>
                <w:left w:w="160" w:type="dxa"/>
                <w:bottom w:w="120" w:type="dxa"/>
                <w:right w:w="160" w:type="dxa"/>
              </w:tblCellMar>
            </w:tblPr>
          `, 'application/xml');
          templateTblPr = getElementByLocalName(mockDOM, 'tblPr').cloneNode(true);
        } catch (e) {
          console.error('Failed compiling mock table properties', e);
        }
      }

      if (templateTblPr) {
        const targetTables = getElementsByLocalName(targetDOM, 'tbl');
        for (let i = 0; i < targetTables.length; i++) {
          const tbl = targetTables[i];
          let tblPr = getElementByLocalName(tbl, 'tblPr');
          if (!tblPr) {
            tblPr = targetDOM.createElementNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'w:tblPr');
            tbl.insertBefore(tblPr, tbl.firstChild);
          }

          // Merge Stylesheet reference
          const templateStyle = getElementByLocalName(templateTblPr, 'tblStyle');
          if (templateStyle) {
            let targetStyle = getElementByLocalName(tblPr, 'tblStyle');
            if (targetStyle) {
              targetStyle.setAttribute('w:val', templateStyle.getAttribute('w:val'));
            } else {
              tblPr.appendChild(targetDOM.importNode(templateStyle, true));
            }
          }

          // Merge Borders
          const templateBorders = getElementByLocalName(templateTblPr, 'tblBorders');
          if (templateBorders) {
            let targetBorders = getElementByLocalName(tblPr, 'tblBorders');
            if (targetBorders) {
              tblPr.replaceChild(targetDOM.importNode(templateBorders, true), targetBorders);
            } else {
              tblPr.appendChild(targetDOM.importNode(templateBorders, true));
            }
          }

          // Merge Cell Padding margins
          const templateCellMar = getElementByLocalName(templateTblPr, 'tblCellMar');
          if (templateCellMar) {
            let targetCellMar = getElementByLocalName(tblPr, 'tblCellMar');
            if (targetCellMar) {
              tblPr.replaceChild(targetDOM.importNode(templateCellMar, true), targetCellMar);
            } else {
              tblPr.appendChild(targetDOM.importNode(templateCellMar, true));
            }
          }

          // Process Table Rows (Header formatting vs Data cell overrides)
          const rows = getElementsByLocalName(tbl, 'tr');
          for (let rIdx = 0; rIdx < rows.length; rIdx++) {
            const row = rows[rIdx];
            const cells = getElementsByLocalName(row, 'tc');
            
            for (let cIdx = 0; cIdx < cells.length; cIdx++) {
              const cell = cells[cIdx];
              let tcPr = getElementByLocalName(cell, 'tcPr');
              if (!tcPr) {
                tcPr = targetDOM.createElementNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'w:tcPr');
                cell.insertBefore(tcPr, cell.firstChild);
              }

              // Remove cell-specific borders and paddings to let the table properties dominate
              const tcBorders = getElementByLocalName(tcPr, 'tcBorders');
              if (tcBorders) tcPr.removeChild(tcBorders);
              
              const tcMar = getElementByLocalName(tcPr, 'tcMar');
              if (tcMar) tcPr.removeChild(tcMar);

              // Shading Clean-up: Preserve header highlights, clean data cell background overrides
              const isHeaderRow = rIdx === 0;
              if (isHeaderRow) {
                // Style Header cells with the primary brand color
                let shd = getElementByLocalName(tcPr, 'shd');
                if (!shd) {
                  shd = targetDOM.createElementNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'w:shd');
                  tcPr.appendChild(shd);
                }
                
                let fillHex = '1F2937'; // Default slate gray for headers
                if (primaryBrandColor) {
                  fillHex = primaryBrandColor.replace('#', '');
                } else if (meta.colors && meta.colors.length > 0) {
                  fillHex = meta.colors[0].replace('#', '');
                }

                shd.setAttribute('w:val', 'clear');
                shd.setAttribute('w:color', 'auto');
                shd.setAttribute('w:fill', fillHex);
                
                // Also force header text color inside header cell to contrast (white text)
                const headerTexts = getElementsByLocalName(cell, 'rPr');
                for (let hIdx = 0; hIdx < headerTexts.length; hIdx++) {
                  const hPr = headerTexts[hIdx];
                  let textColor = getElementByLocalName(hPr, 'color');
                  if (!textColor) {
                    textColor = targetDOM.createElementNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'w:color');
                    hPr.appendChild(textColor);
                  }
                  textColor.setAttribute('w:val', 'FFFFFF');
                  
                  // Force Bold on table headers
                  let boldNode = getElementByLocalName(hPr, 'b');
                  if (!boldNode) {
                    boldNode = targetDOM.createElementNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'w:b');
                    hPr.appendChild(boldNode);
                  }
                }
              } else {
                // Strip manual cell background highlights on data body rows
                const shd = getElementByLocalName(tcPr, 'shd');
                if (shd) tcPr.removeChild(shd);
              }
            }
          }
        }
      }
    }

    // Write back modified document.xml
    const serializer = new XMLSerializer();
    const updatedDocXml = serializer.serializeToString(targetDOM);
    targetZip.file('word/document.xml', updatedDocXml);
  }

  // 4. Copy Headers and Footers files + relationships
  if (copyHeadersFooters) {
    const templateFiles = templateZip.file(/^word\/(header|footer)\d+\.xml$/);
    for (let i = 0; i < templateFiles.length; i++) {
      const file = templateFiles[i];
      const content = await file.async('text');
      targetZip.file(file.name, content);
    }

    const templateMediaFiles = templateZip.file(/^word\/media\/.+$/);
    for (let i = 0; i < templateMediaFiles.length; i++) {
      const file = templateMediaFiles[i];
      const content = await file.async('arraybuffer');
      targetZip.file(file.name, content);
    }

    const templateRels = templateZip.file('word/_rels/document.xml.rels');
    if (templateRels) {
      const content = await templateRels.async('text');
      targetZip.file('word/_rels/document.xml.rels', content);
    }
  }

  // Compile modified ZIP file and return as Blob
  const outputBuffer = await targetZip.generateAsync({ type: 'blob' });
  return outputBuffer;
}
