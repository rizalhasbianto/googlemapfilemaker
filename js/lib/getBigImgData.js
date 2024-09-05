export async function getBigImgdata(id, staticImgUrl) {
    const fetchUrl = 'https://yof5cw2m6rdd27h7nnwhg532dm0idkog.lambda-url.us-east-1.on.aws/big-img?id='+id;
    const fetchOptions = {
        endpoint: fetchUrl,
        method: "GET"
    };
  
    try {
        const data = await fetch(fetchUrl, fetchOptions).then((response) => response.json());
        if(data.fullimg != "not found") {
          const imgdata = data.fullimg ? 'data:image/png;base64, ' + data.fullimg : staticImgUrl+'no-image.png';
          return imgdata
        } 
        return staticImgUrl+'no-image.png'
    } catch (error) {
        return staticImgUrl+'no-image.png'
    }
  }