import { Canvg } from 'canvg';

const ENCODINGS = ['image/png', 'image/jpeg'];

const INITIAL_SCALE = 3;
const FINAL_SCALE = 1;
const SCALE_STEP = 1;

const DATA_URL_REGEX = /^data:((?:\w+\/(?:(?!;).)+)?)((?:;[\w\W]*?[^;])*),(.+)$/;

export default async function generateImage(type: 'png' | 'jpg', svg: string) {
  const encoding = 'image/' + type;

  if (ENCODINGS.indexOf(encoding) === -1) {
    throw new Error('<' + type + '> is an unknown type for converting svg to image');
  }

  const initialSVG = svg;

  let dataURL = '';

  for (let scale = INITIAL_SCALE; scale >= FINAL_SCALE; scale -= SCALE_STEP) {
    let canvas = document.createElement('canvas');

    svg = initialSVG.replace(/width="([^"]+)" height="([^"]+)"/, function (_, widthStr, heightStr) {
      return `width="${
        parseInt(widthStr, 10) * scale
      }" height="${parseInt(heightStr, 10) * scale}"`;
    });

    const context = canvas.getContext('2d');

    if (context) {
      const canvg = Canvg.fromString(context, svg);
      await canvg.render();

      context.globalCompositeOperation = 'destination-over';
      context.fillStyle = 'white';

      context.fillRect(0, 0, canvas.width, canvas.height);

      dataURL = canvas.toDataURL(encoding);

      if (DATA_URL_REGEX.test(dataURL)) {
        return dataURL;
      }
    }
  }

  throw new Error('Error happened generating image. Diagram size is too big.');
}
