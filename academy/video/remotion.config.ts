import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
// Rendu plus net des dégradés et du texte.
Config.setChromiumOpenGlRenderer("angle");
