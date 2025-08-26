# DROPSLANDxICP (Dropsland V2)  

## Project Description  
**Dropsland V2** is a decentralized music platform built on the **Internet Computer Protocol (ICP)**. It enables artists and DJs to share their music directly with fans, offering streaming, interactive profiles, and a tokenized economy powered by **$DROPS**. The project aims to democratize music distribution by reducing intermediaries and giving value back to creators.  

## Features  
- Music streaming and discovery  
- Artist profiles and fan engagement  
- Token-based economy using $DROPS  
- Fully decentralized backend with ICP canisters  
- Modern UI built with React, Next.js, and TailwindCSS  

## Architecture  
- **Canisters**:  
  - `dropsland_v2_assets`: stores and serves music files and assets  
  - `dropsland_v2_backend`: handles business logic, profiles, and economy  
- **Frontend**: Next.js with TailwindCSS for a responsive and modern interface  
- **Utilities**: `upload-music.js` and `upload-music-chunked.js` scripts for uploading and managing music files  

## Live Demo  
Access the deployed app here:  
👉 [Dropsland V2 Demo](https://5q5xx-yiaaa-aaaae-qfcvq-cai.icp0.io)  

## Installation  

### Prerequisites  
- DFINITY SDK (`dfx`)  
- Node.js and npm or pnpm  

### Steps  
```bash
git clone https://github.com/iamjuampi/DROPSLANDxICP.git
cd DROPSLANDxICP
npm install
dfx deploy
npm run dev
