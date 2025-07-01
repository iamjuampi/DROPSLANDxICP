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

// Music files to upload
const musicFiles = [
  { file: "iamjuampi - TOXIC.mp3", name: "TOXIC", artist: "iamjuampi" },
  { file: "Nicola Marti - Better Than Sex-4.mp3", name: "Better Than Sex", artist: "Nicola Marti" },
  { file: "iamjuampi - SHADOWS.mp3", name: "SHADOWS", artist: "iamjuampi" },
  { file: "Flush - Touch It.mp3", name: "Touch It", artist: "Flush" },
  { file: "Flush - Fuck That.mp3", name: "Fuck That", artist: "Flush" },
  { file: "Flush - Sadtisfied.mp3", name: "Sadtisfied", artist: "Flush" }
];

async function uploadMusicFile(filePath, name, artist) {
  try {
    console.log(`Uploading ${name} by ${artist}...`);
    
    // Read file as buffer
    const fileBuffer = fs.readFileSync(filePath);
    const uint8Array = new Uint8Array(fileBuffer);
    
    // Upload to canister
    const result = await actor.uploadMusic(name, artist, Array.from(uint8Array), 'audio/mpeg');
    
    if ('ok' in result) {
      console.log(`✅ Successfully uploaded: ${name} (ID: ${result.ok})`);
      return result.ok;
    } else {
      console.error(`❌ Failed to upload ${name}: ${result.err}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error uploading ${name}:`, error);
    return null;
  }
}

async function uploadAllMusic() {
  console.log('🎵 Starting music upload to ICP mainnet...\n');
  
  const musicDir = path.join(__dirname, 'temp_music');
  
  for (const music of musicFiles) {
    const filePath = path.join(musicDir, music.file);
    
    if (fs.existsSync(filePath)) {
      await uploadMusicFile(filePath, music.name, music.artist);
      // Add a small delay between uploads
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      console.error(`❌ File not found: ${music.file}`);
    }
  }
  
  console.log('\n🎉 Music upload process completed!');
  
  // Get stats
  try {
    const stats = await actor.getMusicStats();
    console.log(`📊 Canister stats: ${stats.totalFiles} files, ${stats.totalSize} bytes`);
  } catch (error) {
    console.error('Error getting stats:', error);
  }
}

// Run the upload
uploadAllMusic().catch(console.error); 