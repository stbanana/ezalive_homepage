import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import defaultMdxComponents from 'fumadocs-ui/mdx';

export function getMdxComponents() {
  return {
    ImageZoom,
    ...defaultMdxComponents
  };
}
