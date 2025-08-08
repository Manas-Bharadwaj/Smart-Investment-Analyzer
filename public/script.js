// Wait for the full page (including images) to load
// window.onload = function() {
//     setTimeout(() => {
//         document.getElementById("spinner").style.display = "none"; // Hide loader
//         document.getElementById("content").classList.remove("hidden"); // Show content
//     }, 10000); // Delay for better user experience
// };

function logoload(){
     var k="";
    let element = document.getElementById("log");
    var text="SMART INVESTMENT ANALYZER";
    console.log(text)
    element.innerText="";
    
    for(let i=0;i<=text.length;i++){
        setTimeout(()=>{
        element.innerText=text.substring(0,i)+"|";
        console.log(text)
    },i*200);
    }
  
    setTimeout(()=>{for(let j=text.length-1;j>=0;j--){
        setTimeout(()=>{
        element.innerText=text.substring(0,j)+"|";
        console.log( text)
    },((text.length - j)*200)+1000);
    }},text.length*200)

     
    setTimeout(logoload, ((26* 2)*200)+1000); 
}
document.addEventListener("DOMContentLoaded", logoload);
