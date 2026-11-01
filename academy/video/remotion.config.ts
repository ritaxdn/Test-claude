import { Config } from "@remotion/cli/config";

// Rendu : H.264, 30 i/s (fixé dans src/Root.tsx), qualité élevée.
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setCodec("h264");
Config.setCrf(18);
Config.setPixelFormat("yuv420p");

// Navigateur : par défaut Remotion télécharge le sien. Si ce téléchargement est
// impossible (réseau filtré), indiquez un Chrome déjà installé :
//   REMOTION_BROWSER=/usr/bin/google-chrome npm run render
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
  Config.setChromeMode("chrome-for-testing");
}
