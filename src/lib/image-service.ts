import type { LocalImageService } from "astro";
import sharpService from "astro/assets/services/sharp";

const service: LocalImageService = {
  ...sharpService,
  async validateOptions(options, config) {
    const rasterizeSVG =
      typeof options.src !== "string" && options.src.format === "svg" && options.format === "png";
    const validated = await sharpService.validateOptions!(options, config);
    // Astro normally preserves SVGs. Explicit PNG requests are used for social
    // previews; Sharp can rasterize them while ordinary SVG rendering stays intact.
    if (rasterizeSVG) validated.format = "png";
    return validated;
  },
};

export default service;
