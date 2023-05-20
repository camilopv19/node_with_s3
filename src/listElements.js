alert("Shit");
const listElements = (data) => {
    //List cleaning
    document.getElementById("list").innerHTML = "";
    if (data.Contents && data.Contents.length > 0) {
      const list = document.getElementById("list");
      data.Contents.forEach(({ Key }, index) => {
        const [_, fileName] = Key.split("/");
        console.log("fileName", fileName);
        //Delete button for each element
        let upBtn = document.createElement("button");
        upBtn.innerHTML = "Delete this object";
        upBtn.className = "delete";
        upBtn.addEventListener("click", (event) => deleteObj(event));
        //Download button for each element
        let downBtn = document.createElement("button");
        downBtn.innerHTML = "Download this object";
        downBtn.className = "info";
        downBtn.addEventListener("click", (event) => downloadObj(event));

        let listNode = document.createElement("li");
        listNode.setAttribute("id", Key);
        listNode.innerHTML = `${fileName}  `;
        let btnContainer = document.createElement("div");
        btnContainer.setAttribute("class", "container");
        btnContainer.appendChild(upBtn);
        btnContainer.appendChild(downBtn);
        listNode.appendChild(btnContainer);
        list.appendChild(listNode);
      });
    } else {
      document.getElementById("list").innerHTML =
        "No elements in Bucket/folder";
    }
};
const myVar = "THIS WORKS!";
module.exports = { myVar, listElements };