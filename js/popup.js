window.onload = function(){
     const targetElement = document.querySelectorAll('.shipping-content')
     const bodyElement = document.querySelector('body')
     const parentElement = document.querySelector('.product__info-container--sticky')
     const parentElement2 = document.querySelector('.product__media-gallery')
     const button = document.createElement('p');
     button.classList = "shipping__button"
     button.textContent = "Shipping - Please Read Before Purchase"
     
     const popUp = document.createElement('div');
     const iframeUrl = 'https://main.d10gukamd0d34o.amplifyapp.com/'
     const svgClose = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-close" fill="none" viewBox="0 0 18 17"><path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor"></path></svg>'
     popUp.innerHTML = `<div class="popup_shipping"><div class="popup_content"><iframe src="${iframeUrl}"></iframe><div class="close_popup">${svgClose}</div></div></div>`

     const styleNode = document.createElement('style');
          styleNode.type = "text/css";
         const styleShipping = '.product__info-container--sticky.showing, .product--stacked .product__info-container--sticky.showing, .product--columns .product__info-container--sticky.showing{z-index:99 !important}.shipping__button{text-decoration:underline;}.close_popup svg{color:rgba(018,018,018,0.75);width:17px;display:block;position:relative;top:53%;left:50%;transform:translate(-50%,-50%)}.popup_content{position:relative;left:50%;transform:translate(-50%,-50%)}.popup_content{width:70%;height:80vh;border:none;top:50%}.popup_content iframe{width:100%;height:100%;border:none}.close_popup{position:absolute;top:15px;right:25px;width:30px;height:30px;border:1px solid #8b8b8b;border-radius:50%}.close svg{width:17px;display:block;top:53%}.popup_shipping{display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:#0000005e;z-index:9}@media only screen and (max-width:600px){.popup_content{width:90%}}'
          if(!!(window.attachEvent && !window.opera)) {
               styleNode.styleSheet.cssText = styleShipping;
          } else {
               var styleText = document.createTextNode(styleShipping);
               styleNode.appendChild(styleText);
          }

     document.getElementsByTagName('head')[0].appendChild(styleNode);

     for (let i = 0; i < targetElement.length; i++) {
          targetElement[i].appendChild(button);
     }

     bodyElement.appendChild(popUp);

      function showContent(){
          document.querySelector('.popup_shipping').style.display ='block'
          const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
          const body = document.body;
          body.style.overflow = 'hidden';

          if(parentElement) {
               parentElement.classList.add("showing")
          } 
          if(parentElement2) {
               parentElement2.classList.add("showing")
          } 
       }

     function hideContent(){
          const body = document.body;
          body.style.overflow = '';
          document.querySelector('.popup_shipping').style.display ='none'

          if(parentElement) {
               parentElement.classList.remove("showing")
          }
          if(parentElement2) {
               parentElement2.classList.remove("showing")
          }
       }

     document.body.addEventListener('keyup', function(e) {
          if (e.key == "Escape") {
               hideContent();
          }
     });

     window.addEventListener('scroll', () => {
          document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
        });

     document.querySelector('.shipping__button').addEventListener('click', showContent)
     document.querySelector('.close_popup').addEventListener('click', hideContent)
   };