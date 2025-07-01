const fs = require('fs');
const path = require('path');
const { Actor, HttpAgent } = require('@dfinity/agent');
const { Principal } = require('@dfinity/principal');

// Import the IDL factory
const { idlFactory } = require('./src/declarations/dropsland_backend/dropsland_backend.did.js');

// Canister ID from the deployed backend
const CANISTER_ID = "5c3ao-uyaaa-aaaae-qfcwq-cai";

// Create agent and actor
const agent = new HttpAgent({
  host: "https://ic0.app"
});

const actor = Actor.createActor(idlFactory, {
  agent: agent,
  canisterId: CANISTER_ID
});

// Configuration
const CHUNK_SIZE = 3 * 1024 * 1024; // 3MB chunks (under 4MB limit)

// Music files to upload
const musicFiles = [
  { file: "iamjuampi - TOXIC.mp3", name: "TOXIC", artist: "iamjuampi" },
  { file: "Nicola Marti - Better Than Sex-4.mp3", name: "Better Than Sex", artist: "Nicola Marti" },
  { file: "iamjuampi - SHADOWS.mp3", name: "SHADOWS", artist: "iamjuampi" },
  { file: "Flush - Touch It.mp3", name: "Touch It", artist: "Flush" },
  { file: "Flush - Fuck That.mp3", name: "Fuck That", artist: "Flush" },
  { file: "Flush - Sadtisfied.mp3", name: "Sadtisfied", artist: "Flush" }
];

// Split file into chunks
function splitIntoChunks(fileBuffer) {
  const chunks = [];
  for (let i = 0; i < fileBuffer.length; i += CHUNK_SIZE) {
    chunks.push(fileBuffer.slice(i, i + CHUNK_SIZE));
  }
  return chunks;
}

async function uploadMusicFileChunked(filePath, name, artist) {
  try {
    console.log(`🎵 Starting chunked upload for ${name} by ${artist}...`);
    
    // Read file as buffer
    const fileBuffer = fs.readFileSync(filePath);
    const uint8Array = new Uint8Array(fileBuffer);
    
    // Split into chunks
    const chunks = splitIntoChunks(uint8Array);
    console.log(`📦 File split into ${chunks.length} chunks (${chunks.length * CHUNK_SIZE / 1024 / 1024}MB total)`);
    
    // Create upload session
    console.log('📝 Creating upload session...');
    const sessionResult = await actor.createUploadSession(
      name,
      artist,
      'audio/mpeg',
      chunks.length,
      uint8Array.length
    );
    
    if ('err' in sessionResult) {
      throw new Error(`Failed to create upload session: ${sessionResult.err}`);
    }
    
    const sessionId = sessionResult.ok;
    console.log(`✅ Upload session created: ${sessionId}`);
    
    // Upload chunks
    console.log('📤 Uploading chunks...');
    for (let i = 0; i < chunks.length; i++) {
      console.log(`  Uploading chunk ${i + 1}/${chunks.length}...`);
      
      const chunkResult = await actor.uploadChunk(
        sessionId,
        i,
        Array.from(chunks[i])
      );
      
      if ('err' in chunkResult) {
        throw new Error(`Failed to upload chunk ${i}: ${chunkResult.err}`);
      }
      
      // Add a small delay between chunks
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Finalize upload
    console.log('🔗 Finalizing upload...');
    const finalizeResult = await actor.finalizeUpload(sessionId);
    
    if ('err' in finalizeResult) {
      throw new Error(`Failed to finalize upload: ${finalizeResult.err}`);
    }
    
    const musicId = finalizeResult.ok;
    console.log(`✅ Successfully uploaded: ${name} (ID: ${musicId})`);
    return musicId;
    
  } catch (error) {
    console.error(`❌ Error uploading ${name}:`, error.message);
    return null;
  }
}

async function uploadAllMusicChunked() {
  console.log('🎵 Starting chunked music upload to ICP mainnet...\n');
  
  const musicDir = path.join(__dirname, 'temp_music');
  const successfulUploads = [];
  
  for (const music of musicFiles) {
    const filePath = path.join(musicDir, music.file);
    
    if (fs.existsSync(filePath)) {
      const musicId = await uploadMusicFileChunked(filePath, music.name, music.artist);
      if (musicId) {
        successfulUploads.push({ name: music.name, id: musicId });
      }
      // Add delay between files
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      console.error(`❌ File not found: ${music.file}`);
    }
  }
  
  console.log('\n🎉 Chunked music upload process completed!');
  console.log(`✅ Successfully uploaded ${successfulUploads.length}/${musicFiles.length} files`);
  
  if (successfulUploads.length > 0) {
    console.log('\n📋 Uploaded files:');
    successfulUploads.forEach(file => {
      console.log(`  - ${file.name} (ID: ${file.id})`);
    });
  }
  
  // Get stats
  try {
    const stats = await actor.getMusicStats();
    console.log(`\n📊 Canister stats: ${stats.totalFiles} files, ${stats.totalSize} bytes`);
  } catch (error) {
    console.error('Error getting stats:', error);
  }
}

// Run the upload
uploadAllMusicChunked().catch(console.error); 