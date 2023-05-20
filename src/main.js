import { myVar, listElements } from "./listElements";
document.getElementById("file").addEventListener("change", function (e) {
    if (e.target.files[0]) {
        const btn = document.getElementById("btnUp");
        btn.removeAttribute("disabled");
        btn.innerHTML = "Upload";
    }
});

// console.log('myVar from script 1', myVar);
const getMetadata = () => {
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

// UPLOAD
const upload = async () => {
    // const form = document.getElementById("upForm");
    // const formdata = new FormData(form);
    const formdata = new FormData();
    const input = document.getElementById("file");
    const file = input.files[0];
    if (!file) {
        alert("No file selected.");
        return;
    }

    const url = "/upload"; // Replace with your server's upload endpoint

    const formData = new FormData();
    formData.append("input_files", file);

    fetch(url, {
        method: "POST",
        body: formData,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`File upload failed. Status: ${response.status}`);
            }
            alert("File uploaded successfully!");
        })
        .catch((error) => {
            console.error("Error uploading file:", error);
            alert("File upload failed. Please try again.");
        });
    const btn = document.getElementById("btnUp");
    btn.setAttribute("disabled", true);
    input.value = null;
};

// GET
const getFiles = async () => {
    //Getting data
    const data = await fetch("/list?folderName=public_asset");
    data.json().then(({ data }) => listElements(data));
};

// DELETE
const deleteObj = async ({
    target: {
        parentNode: {
            parentNode: { id },
        },
    },
}) => {
    console.log("id", id);
    let response = await fetch("/remove", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ fileKeys: [id] }),
    });
    response.json().then(({ msg }) => {
        alert(msg);
        document.getElementById(id).remove();
    });
};

// DOWNLOAD
const downloadObj = async ({
    target: {
        parentNode: {
            parentNode: { id },
        },
    },
}) => {
    const [_, file] = id.split("/");
    const url = "/download";
    const queryParams = new URLSearchParams({ file });
    let response = await fetch(`${url}?${queryParams.toString()}`, {
        method: "GET",
    });
    if (!response.ok) {
        throw new Error(
            `Failed to download file. Status: ${response.status}`
        );
    }
    const contentDisposition = response.headers.get("content-disposition");

    /**
     * Regex to match the first appearance of slash (after the folder) and
     * (.+) is a capturing group that matches one or more characters of any type,
     * except for line breaks. The parentheses () define the capturing group.
     * So the matching pattern captures the substring following the first
     * occurrence of slash "/" to the end
     */
    const fileNameMatch = contentDisposition?.match(/\/(.+)/);
    const fileName = fileNameMatch ? fileNameMatch[1] : "downloaded_file";

    const blob = await response.blob();

    // Create a temporary link element to trigger the file download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};