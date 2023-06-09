export async function getBigImgdata(id, staticImgUrl) {
    const fetchUrl = 'https://BluePrintMap.hellomuto.repl.co/big-img?id='+id;
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
