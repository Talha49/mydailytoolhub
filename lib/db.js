import mongoose from 'mongoose'
import dns from 'dns'

// Force IPv4 resolution first (prevents Windows localhost/IPv6 lookups failing)
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first')
}

// Override DNS servers to Google DNS (8.8.8.8)
// This fixes local ISP/router DNS failures in resolving MongoDB Atlas SRV (_mongodb._tcp) records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4'])
} catch (e) {
  console.warn('Warning: Could not set custom DNS servers for MongoDB resolution:', e.message)
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env')
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null;
    throw e
  }

  return cached.conn
}

export default dbConnect
