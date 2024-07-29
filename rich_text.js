const textField = document.querySelector("#text-field");
window.onload = function () {
  textField.focus();
};

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", function (e) {
    e.stopPropagation();
    document.querySelectorAll(".nav-item").forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.classList.remove("show-submenu");
      }
    });
    this.classList.add("show-submenu");
    if (document.getElementById("dialogOverlay").contains("active")) {
      hideDialogueBox();
    }
  });
  document.addEventListener("click", function (e) {
    if (!item.contains(e.target)) {
      item.classList.remove("show-submenu");
    }
  });
  item.querySelectorAll(".submenu").forEach((submenu) => {
    submenu.addEventListener("mousedown", function (e) {
      e.preventDefault();
    });
  });
});

const searchTxt = document.getElementById("searchText"),
  undoBtn = document.getElementById("undoBtn"),
  redoBtn = document.getElementById("redoBtn"),
  printDoc = document.getElementById("printDoc"),
  fontDrop = document.getElementById("fontDrop"),
  zooIn = document.getElementById("zoomIn"),
  zoomOut = document.getElementById("zoomOut"),
  changeTextStyle = document.getElementById("changeTextStyle"),
  changeFontFamily = document.getElementById("changeFontFamily"),
  changeFontSize = document.getElementById("fontSize"),
  boldBtn = document.getElementById("boldBtn"),
  italicBtn = document.getElementById("italicBtn"),
  underlineBtn = document.getElementById("underlineBtn"),
  Strikethrough = document.getElementById("Strikethrough"),
  SuperScript = document.getElementById("SuperScript"),
  SubScript = document.getElementById("SubScript"),
  capitalizeBtn = document.querySelectorAll("#capitalizeBtn li"),
  insertLink = document.getElementById("insertLink"),
  attachImage = document.getElementById("attachImage"),
  leftBtn = document.getElementById("leftBtn"),
  centerBtn = document.getElementById("centerBtn"),
  rightBtn = document.getElementById("rightBtn"),
  justifyBtn = document.getElementById("justifyBtn"),
  ordList = document.getElementById("ordList"),
  unordList = document.getElementById("unordList"),
  outdentBtn = document.getElementById("outdentBtn"),
  indentBtn = document.getElementById("indentBtn"),
  removeBtn = document.getElementById("removeBtn"),
  fullScrBtn = document.getElementById("fullScrBtn"),
  horizontalBtn = document.getElementById("horizontalBtn"),
  codeBtn = document.getElementById("codeBtn"),
  lineHeight = document.querySelectorAll("#lineHeight li"),
  cutBtn = document.getElementById("cutBtn"),
  copyBtn = document.getElementById("copyBtn"),
  pasteBtn = document.getElementById("pasteBtn"),
  pasteWtBtn = document.getElementById("pasteWtBtn"),
  emailSend = document.getElementById("emailSend"),
  deleteFile = document.getElementById("deleteFile"),
  selectAll = document.getElementById("selectAll"),
  countData = document.getElementById("countData"),
  newTab = document.getElementById("newTab"),
  newFile = document.getElementById("openFile"),
  dialogContainer = document.getElementById("dialogOverlay"),
  downloadBtn = document.getElementById("downloadBtn"),
  pageSetup = document.getElementById("pageSetup"),
  localSave = document.getElementById("localSave");

document.addEventListener("mousedown", function (event) {
  var isClickInside =
    textField.contains(event.target) || textField === event.target;
  var isInputOrSelect =
    event.target.tagName === "INPUT" ||
    event.target.tagName === "TEXTAREA" ||
    event.target.tagName === "SELECT";

  if (!isClickInside && !isInputOrSelect) {
    event.preventDefault();
  }
});
searchTxt.addEventListener("click", (e) => {
  e.stopPropagation();
  findReplace.click();
});
document.querySelectorAll(".tooltip").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    btn.classList.toggle("active");
  });
});

cutBtn.addEventListener("click", (e) => {
  if(!preventCopy){
    document.execCommand("cut");
  }
});
copyBtn.addEventListener("click", (e) => {
  if(!preventCopy){
  document.execCommand("copy");
  }
});
pasteBtn.addEventListener("click", (e) => {
  navigator.clipboard
    .read()
    .then((items) => {
      for (let item of items) {
        if (item.types.includes("text/html")) {
          item.getType("text/html").then((blob) => {
            blob.text().then((html) => {
              document.execCommand("insertHTML", false, html);
            });
          });
        } else if (item.types.includes("text/plain")) {
          item.getType("text/plain").then((blob) => {
            blob.text().then((text) => {
              document.execCommand("insertText", false, text);
            });
          });
        }
      }
    })
    .catch((err) => {
      console.error("Failed to read clipboard contents: ", err);
    });
});
pasteWtBtn.addEventListener("click", (e) => {
  navigator.clipboard
    .readText()
    .then((text) => {
      document.execCommand("insertText", false, text);
    })
    .catch((err) => {
      console.error("Failed to read clipboard contents: ", err);
    });
});
// ----------------------------------------------------------------------------------
document.getElementById("insertTable").addEventListener("click", insertTable);
function insertTable() {
  let content = `
    <div class="dialog">
      <div class="text-content">Create Table</div>
      <div class="input-field">
        <label>Rows</label>
        <input type="number" step="1" value="5" id="tblRows" style="--width:50px;;">
      </div>
      <div class="input-field">
        <label>Cols</label>
        <input type="number" step="1" value="5" id="tblCols" style="--width:50px;;">
      </div>
      <div class="input-field">
        <label>Table Width (%)</label>
        <input type="number" step="1" value="100" id="tblWidth" style="--width:50px;;">
      </div>
      <div class="input-field">
        <label>Odd Row Color</label>
        <input type="color" style="--width:50px;" value="#f0f0f0" id="tdColors">
      </div>
      <div class="input-field">
        <label>Header Row</label>
        <input type="checkbox" id="tblHeader" checked>
      </div>
      <div class="input-field">
        <label>Table Caption</label>
        <input type="text" id="tblCaption" placeholder="Optional">
      </div>
      <div class="btns">
        <button onclick="createTable()">Create</button>
      </div>
    </div>
  `;
  showDialog(content);
}
let tableCount = 1;

function createTable() {
  var rows = document.getElementById("tblRows").value;
  var cols = document.getElementById("tblCols").value;
  var width = document.getElementById("tblWidth").value;
  var tdColor = document.getElementById("tdColors").value;
  var hasHeader = document.getElementById("tblHeader").checked;
  var caption = document.getElementById("tblCaption").value;

  let table = `<table border="1" id="tbl${tableCount}" class="customTbl" style="border-collapse: collapse; border: 1px solid #000; width: ${width}%; --td-back:${tdColor};">`;
  if (caption) {
    table += `<caption>${caption}</caption>`;
  }
  for (let i = 0; i < rows; i++) {
    table += "<tr>";
    for (let j = 0; j < cols; j++) {
      if (i === 0 && hasHeader) {
        table += `<th>&nbsp;</th>`;
      } else {
        table += `<td>&nbsp;</td>`;
      }
    }
    table += "</tr>";
  }
  table += "</table><br>";
  tableCount++;
  const editor = document.querySelector(".text-field");
  editor.focus();
  document.execCommand("insertHTML", false, table);
  const firstCell = document.querySelector(`#tbl${tableCount - 1} td:first-child`);
  if (firstCell) {
    firstCell.focus();
  }
  hideDialogueBox();
}
// ------------------------------------------------------------
let savedSelectionRange, savedSelectionNode;

document.getElementById("insertChart").addEventListener("click", (e) => {
  saveSelection();
  let content = `
      <div class="text-content">Create Bar Chart</div>
      <div class="input-field">
          <label>Each Bar Width (px)</label>
          <input type="number" value="50" id="barWidth" step="5" placeholder="5px" style="--width:50px;">
      </div>
      <div class="input-field">
          <label>Labels (comma separated)</label>
          <textarea type="text" id="chartLabels" placeholder="Label1,Label2,Label3" autocomplete="on" autofocus></textarea>
      </div>
      <div class="input-field">
          <label>Values (comma separated)</label>
          <textarea type="text" id="chartValues" placeholder="10,20,30" autocomplete="on"></textarea>
      </div>
      <div class="input-field">
          <label>Colors (comma separated)</label>
          <textarea type="text" id="chartColors" placeholder="#FF851B,#FFDC00,#39CCCC" autocomplete="on"></textarea>
      </div>
      <div class="btns">
          <button onclick="createBarChart()">Create</button>
      </div>
  `;
  showDialog(content);
});

function saveSelection() {
  const sel = window.getSelection();
  if (sel.rangeCount > 0) {
    savedSelectionRange = sel.getRangeAt(0);
    savedSelectionNode = sel.anchorNode;
  }
}

function restoreSelection() {
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(savedSelectionRange);
}

function createBarChart() {
  const barWidth = document.getElementById("barWidth").value;
  const labels = document.getElementById("chartLabels").value.split(",");
  const values = document
    .getElementById("chartValues")
    .value.split(",")
    .map(Number);
  const colors = document.getElementById("chartColors").value.split(",");

  let maxVal = Math.max(...values);

  const chart = document.createElement("div");
  chart.className = "bar-chart";
  chart.style = `--width:${barWidth}px;`;
  chart.setAttribute("contenteditable", "false");

  if (
    values.length !== labels.length ||
    labels.length !== colors.length ||
    values.length !== colors.length
  ) {
    let alert = `Label, values and color should be equal.`;
    document.getElementById("alert-msg").textContent = alert;
    return;
  }
  let createChart = true;
  values.forEach((value, index) => {
    if (!Number.isInteger(Number(value))) {
      let alert = `Value must be number.`;
      document.getElementById("alert-msg").textContent = alert;
      createChart = false;
    }
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${(value / maxVal) * 100}%`;
    bar.style.setProperty("--bar-color", colors[index]);
    bar.innerHTML = `<span class="bar-value">${value}</span>`;
    chart.appendChild(bar);
  });

  const labelContainer = document.createElement("div");
  labelContainer.className = "label-container";

  labels.forEach((label, index) => {
    const labelDiv = document.createElement("div");
    labelDiv.className = "label";
    labelDiv.style.setProperty("--label-color", colors[index]);
    labelDiv.innerHTML = `<span class="bar-color"></span><span class="bar-label">${label}</span>`;
    labelContainer.appendChild(labelDiv);
  });
  if (createChart) {
    chart.appendChild(labelContainer);
    restoreSelection();

    const editor = document.querySelector(".text-field");
    document.execCommand("insertHTML", false, chart.outerHTML);
    editor.innerHTML += "<br>";
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStartAfter(editor.lastChild);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    hideDialogueBox();
  }
}

// --------------------------------------------------------------
undoBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("undo");
});

redoBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("redo");
});

zooIn.addEventListener("click", (e) => {
  e.stopPropagation();
  const currentSize = window.getComputedStyle(textField).fontSize;
  textField.style.fontSize = parseInt(currentSize) + 2 + "px";
});

zoomOut.addEventListener("click", (e) => {
  e.stopPropagation();
  const currentSize = window.getComputedStyle(textField).fontSize;
  textField.style.fontSize = parseInt(currentSize) - 2 + "px";
});

changeTextStyle.addEventListener("change", (e) => {
  e.stopPropagation();
  if (e.target.value === "") {
    document.execCommand("formatBlock", false, "p");
  }
  document.execCommand("formatBlock", false, e.target.value);
});

changeFontFamily.addEventListener("change", (e) => {
  e.stopPropagation();
  if (e.target.value == "arial") {
    document.execCommand("fontName", false, "Arial, sans-serif");
  }
  document.execCommand("fontName", false, e.target.value);
});

// font size changing
let disableSelectionChange = false;

document.addEventListener("selectionchange", () => {
  if (disableSelectionChange) return;

  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const selectedElement = range.commonAncestorContainer.parentElement;
    if (textField.contains(selectedElement)) {
      const computedStyle = window
        .getComputedStyle(selectedElement, null)
        .getPropertyValue("font-size");
      changeFontSize.value = parseInt(computedStyle, 10);
    }
  }
});

function changeSize(change) {
  let currentSize = parseInt(changeFontSize.value, 10);
  let newSize = currentSize + change;

  if (newSize < 1) {
    newSize = 1;
  } else if (newSize > 100) {
    newSize = 100;
  }

  changeFontSize.value = newSize;
  setFontSize(newSize);

  disableSelectionChange = true;
  setTimeout(() => {
    disableSelectionChange = false;
  }, 100);
}

function setFontSize(size) {
  let selection = window.getSelection();
  if (!selection.rangeCount) return;

  let range = selection.getRangeAt(0);
  let span = document.createElement('span');
  span.style.fontSize = size + 'px';
  span.textContent = range.toString();

  range.deleteContents();
  range.insertNode(span);
}
document.getElementById("fontSizeOptions").addEventListener("change", (e) => {
  e.stopPropagation();
  setFontSize(e.target.value);
});
// end of changing font
boldBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("bold");
});

italicBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("italic");
});

underlineBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("underline");
});

SuperScript.addEventListener("click", (e) => {
  document.execCommand("superscript");
});

SubScript.addEventListener("click", (e) => {
  document.execCommand("subscript");
});

Strikethrough.addEventListener("click", (e) => {
  document.execCommand("strikethrough");
});

function transformText(transformation) {
  let selection = window.getSelection();
  if (selection.rangeCount > 0) {
    let range = selection.getRangeAt(0);
    let selectedText = range.toString();

    let transformedText;
    if (transformation === "uppercase") {
      transformedText = selectedText.toUpperCase();
    } else if (transformation === "lowercase") {
      transformedText = selectedText.toLowerCase();
    } else if (transformation === "capitalize") {
      transformedText =
        selectedText.charAt(0).toUpperCase() +
        selectedText.slice(1).toLowerCase();
    }

    range.deleteContents();
    range.insertNode(document.createTextNode(transformedText));
  }
}
capitalizeBtn.forEach((button) => {
  button.addEventListener("click", (e) => {
    const value = e.target.textContent.trim().toLowerCase();
    transformText(value);
  });
});

function toggleColorInput(inputId) {
  const input = document.getElementById(inputId);
  input.click();
}

function changeFontColor(color) {
  document.execCommand("foreColor", false, color);
}

function highlightText(color) {
  document.execCommand("hiliteColor", false, color);
}

let savedRange;

insertLink.addEventListener("click", (e) => {
  e.stopPropagation();
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    savedRange = selection.getRangeAt(0);
  }

  let content = `
    <div class="text-content">Insert Link</div>
    <div style="display:flex; justify-content:space-between; align-items:center; gap:3px;">
      <label>Paste Link:</label>
      <select id="linkType">
        <option value="http://">Link</option>
        <option value="mailto:">Mail</option>
        <option value="tel:+">Phone</option>
      </select>
      <input type="url" id="linkUrl"/>
    </div>
    <div class="btns">
      <button onclick="createLink()">Insert Link</button>
    </div>
  `;
  showDialog(content);
  document.getElementById("linkUrl").focus();
});

function createLink() {
  var url = document.getElementById("linkUrl").value;
  var linkType = document.getElementById("linkType").value;

  if (url) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedRange);

    if (linkType === "mailto:" || linkType === "tel:+") {
      url = linkType + url;
    }

    document.execCommand("createLink", false, url);
    hideDialogueBox();
  }
}

// ------------------------------------------------------
let imgRange;
attachImage.addEventListener("click", (e) => {
  e.stopPropagation();
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    imgRange = selection.getRangeAt(0);
  }

  let content = `
    <div class="text-content">
      Choose how you would like to add Image.
    </div>
    <div class="btns">
      <button onclick="imageReader()">Upload
        <input type="file" accept="image/*" id="imageUpload" multiple hidden>
      </button>
      <button onclick="imageViaUrl()">Via Url</button>
    </div>
  `;
  showDialog(content);
});

function imageReader() {
  let imageUploadButton = document.getElementById("imageUpload");
  imageUploadButton.click();
      imageUploadButton.addEventListener("change", (e) => {
        e.stopImmediatePropagation();
        readImages(imageUploadButton);
      });
}

function readImages(input) {
  if (input.files) {
    Array.from(input.files).forEach((file) => {
      var reader = new FileReader();
      reader.onload = function (e) {
        insertImageAtCursor(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }
}
function insertImageAtCursor(dataUrl) {
  textField.focus();
  const selection = window.getSelection();
  if (imgRange) {
    selection.removeAllRanges();
    selection.addRange(imgRange);
  }
  var img = document.createElement("img");
  img.src = dataUrl;
  var range = selection.getRangeAt(0);
  range.deleteContents();
  range.insertNode(img);
  range.setStartAfter(img);
  range.setEndAfter(img);
  selection.removeAllRanges();
  selection.addRange(range);
  imgRange = null;
  hideDialogueBox();
}
function replaceImg(index) {
  const img = textField.querySelectorAll("img")[index];
  if (img) {
    const range = document.createRange();
    range.selectNode(img);
    imgRange = range;
    img.remove();

    const newInput = document.createElement("input");
    newInput.type = "file";
    newInput.accept = "image/*";
    newInput.multiple = true;
    newInput.style.display = "none";
    document.body.appendChild(newInput);
    newInput.click();
    newInput.addEventListener("change", (e) => {
      e.stopImmediatePropagation();
      readImages(newInput);
      document.body.removeChild(newInput); 
    });
  }
}

function imageViaUrl() {
  let add = `
    <br><br><hr>
    <div class="input-field">
      <label>Image Url</label>
      <input id="imgUrl" type="url"/>
    </div>
    <div class="btns">
      <button onclick="imgUrlSubmit()">Add</button>
    </div>
  `;
  document
    .getElementById("dialogueMainContent")
    .insertAdjacentHTML("beforeend", add);
}

function imgUrlSubmit() {
  var url = document.getElementById("imgUrl").value;
  if (url) {
    insertImageAtCursor(url);
  }
}
// images inserted-------------------------------------------------------------------

leftBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("justifyLeft");
});

centerBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("justifyCenter");
});

rightBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("justifyRight");
});
justifyBtn.addEventListener("click", (e) => {
  var alignment = document.queryCommandValue("justify");
  if (alignment === "left") {
    document.execCommand("justifyCenter", false, null);
  } else {
    document.execCommand("justifyLeft", false, null);
  }
});
ordList.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("insertOrderedList");
});

unordList.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("insertUnorderedList");
});

outdentBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("outdent");
});

indentBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("indent");
});

removeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("removeFormat");
});

let hrRange;
horizontalBtn.addEventListener("click", (e) => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    hrRange = selection.getRangeAt(0);
  }
  e.preventDefault();
  e.stopPropagation();
  let content = `
   <div class="input-field">
    <label>Line Type</label>
    <select id="lineType">
     <option value="solid">Plane</option>
     <option value="dashed">Dashed</option>
     <option value="dotted">Dotted</option>
     <option value="groove">Groove</option>
     <option value="ridge">Ridge</option>
    </select>
   </div>
   <div class="input-field">
    <label>Line Width(%)</label>
    <input type="number" value="100" style="--width:50px;" id="HLineWidth" step="10"/>
   </div>
   <div class="input-field">
    <label>Line Thickness(px)</label>
    <input type="number" value="2" style="--width:50px;" id="HLinethickNess"/>
   </div>
   <div class="input-field">
    <label>Choose Color</label>
    <input type="color" style="--width:50px;" id="hColor">
   </div>
   <div class="btns">
   <button onclick="changeLineStyle()">Apply</button>
   </div>
  `;
  showDialog(content);
});
function changeLineStyle() {
  let lineType = document.getElementById("lineType").value;
  let lineWidth = document.getElementById("HLineWidth").value;
  let lineThickness = document.getElementById("HLinethickNess").value;
  let lineColor = document.getElementById("hColor").value;

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(hrRange);

  const hr = document.createElement("hr");
  hr.contentEditable = false;
  hr.style.width = `${lineWidth}%`;
  hr.style.borderStyle =`${lineType}`;
  hr.style.borderWidth = `${lineThickness}px`;
  hr.style.borderColor =`${lineColor}`;

  var range = selection.getRangeAt(0);
  range.deleteContents();
  range.insertNode(hr);
  range.setStartAfter(hr);
  range.collapse(true);
  range.setEndAfter(hr);
  selection.removeAllRanges();
  selection.addRange(range);
  hideDialogueBox();
}


lineHeight.forEach((item) => {
  item.addEventListener("click", (e) => {
    const lineHeightValue = e.target.textContent.trim();
    let selection = window.getSelection();
    if (selection.rangeCount > 0) {
      let range = selection.getRangeAt(0);
      let commonAncestor = range.commonAncestorContainer;
      let existingTag = null;
      if (commonAncestor.nodeType === Node.TEXT_NODE) {
        commonAncestor = commonAncestor.parentNode;
      }
      if (commonAncestor && commonAncestor !== document.body) {
        if (
          commonAncestor.style &&
          commonAncestor.style.lineHeight !== lineHeightValue
        ) {
          commonAncestor.style.lineHeight = lineHeightValue;
        } else {
          let newTag = document.createElement("span");
          newTag.style.lineHeight = lineHeightValue;
          range.surroundContents(newTag);
        }
      }
    }
  });
});

fullScrBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!document.fullscreenElement) {
    document.getElementById("editor-container").requestFullscreen().catch((err) => {
      alert(
        `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
      );
    });
  } else {
    document.exitFullscreen();
  }
});

let sourceCode = true;
let preventCopy = false;

codeBtn.addEventListener("click", (e) => {
  if (sourceCode === true) {
    const editorHTML = textField.innerHTML;
    originalHTML = editorHTML;
    const escapedHTML = escapeHtml(editorHTML);
    document.querySelector(".text-field").innerHTML = escapedHTML;
    sourceCode = false;
    document.title = "Mero Document - source";
    preventCopy = true;
  } else {
    textField.innerHTML = originalHTML;
    sourceCode = true;
    document.title = "Mero Document";
    preventCopy = false;
  }
});

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

countData.addEventListener("click", showDataInfo);
function showDataInfo() {
  let data = textField.textContent.trim();
  let letterCount = data.length;
  let wordCount = data.split(/\s+/).filter((word) => word !== "").length;
  let sentenceCount = data
    .split(/[.!?]+/)
    .filter((sentence) => sentence.trim() !== "").length;
  let imageCount = textField.getElementsByTagName("img").length;
  let content = `
  <div class="text-content">
   Document Information
  </div>
  <ul>
   <li>Letters <span>${letterCount}</span></li>
   <li>Words <span>${wordCount}</span></li>
   <li>Sentences <span>${sentenceCount}</span></li>
   <li>Images <span>${imageCount}</span></li>
  <ul>
 `;
  showDialog(content);
}

// by default capitalize when sentence completed
let capitalizeRange;
textField.addEventListener("keydown", function (event) {
  if ((event.metaKey || event.ctrlKey) && event.key === "h") {
    event.preventDefault();
    horizontalBtn.click();
  }
  if ((event.metaKey || event.ctrlKey) && event.key === "l") {
    event.preventDefault();
    insertLink.click();
  }
});
function placeCaretAtEnd(el) {
  el.focus();
  if (
    typeof window.getSelection !== "undefined" &&
    typeof document.createRange !== "undefined"
  ) {
    var range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}
// send email to user
emailSend.addEventListener("click", (e) => {
  if (
    textField.textContent.trim() == "" &&
    textField.getElementsByTagName("img").length < 1
  ) {
    emptyDoc();
    return;
  }
  let content = `
    <div class="input-field">
     <label>To:</label>
     <input type="email" id="emailId" placeholder="receiver email"/>
    </div>
    <div class="input-field">
     <label>Subject</label>
     <input id="subjectEm" placeholder="subject of email">
    </div>
    <div class="btns">
     <button onclick="sendEmail()">Send</button>
    </div>
  `;
  showDialog(content);
});
function sendEmail() {
  const body = textField.innerHTML;
  const to = document.getElementById("emailId").value;
  const subject = document.getElementById("subjectEm").value;
  const encodedBody = encodeURIComponent(body);
  const encodedSubject = encodeURIComponent(subject);
  const encodedTo = encodeURIComponent(to);

  if (to && subject) {
    openMailClient(encodedTo, encodedSubject, encodedBody);
  } else {
    let alert = "Reciever email and subject of email both are required.";
    document.getElementById("alert-msg").textContent = alert;
  }
}
function testMailtoSupport() {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    iframe.onload = () => {
      document.body.removeChild(iframe);
      resolve(false);
    };

    iframe.onerror = () => {
      document.body.removeChild(iframe);
      resolve(true);
    };

    iframe.src = "mailto:test@example.com";
    setTimeout(() => resolve(false), 2000);
  });
}

async function openMailClient(encodedTo, encodedSubject, encodedBody) {
  const isSupported = await testMailtoSupport();
  if (isSupported) {
    window.open(
      `mailto:${encodedTo}?subject=${encodedSubject}&body=${encodedBody}`,
      "_blank"
    );
  } else {
    var alert = "Your browser does not support opening email clients directly.";
    document.getElementById("alert-msg").textContent = alert;
  }
}

deleteFile.addEventListener("click", (e) => {
  document.execCommand("insertHTML", false, "");
});

selectAll.addEventListener("click", (e) => {
  const range = document.createRange();
  range.selectNodeContents(textField);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
});

newTab.addEventListener("click", (e) => {
  window.open(window.location.href, "_blank");
});
// read file from users device
let fileRange;
document.getElementById("openFile").addEventListener("click", function () {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    fileRange = selection.getRangeAt(0);
  }
  document.getElementById("newFile").click();
});

document.getElementById("newFile").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const content = e.target.result;

      if (file.type === "text/plain") {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(fileRange);
        document.execCommand("insertHTML", false, content);
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        mammoth
          .convertToHtml({ arrayBuffer: reader.result })
          .then(function (result) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(fileRange);
            document.execCommand("insertHTML", false, result.value);
          })
          .catch(function (err) {
            console.log(err);
          });
      } else {
        let content = `
               <div class="text-content">File type not supported currently.</div>
              `;
        showDialog(content);
      }
    };

    if (file.type === "text/plain") {
      reader.readAsText(file);
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      reader.readAsArrayBuffer(file);
    }
  }
});

const tooltips = document.querySelectorAll("tooltip"),
  navItems = document.querySelectorAll(".nav-item"),
  ownMenu = document.getElementById("custom-menu"),
  dialogueBox = document.getElementById("dialogBox");
document.addEventListener("click", (e) => {
  let clickedOutside = true;
  tooltips.forEach((tooltip) => {
    if (tooltip.contains(e.target)) {
      clickedOutside = false;
    }
  });
  navItems.forEach((navItem) => {
    if (navItem.contains(e.target)) {
      clickedOutside = false;
    }
  });
  if (dialogueBox.contains(e.target)) {
    clickedOutside = false;
  }
  if (ownMenu.contains(e.target)) {
    clickedOutside = false;
  }
  if (clickedOutside) {
    hideDialogueBox();
  }
});

const findReplace = document.getElementById("findReplace");
findReplace.addEventListener("click", (e) => {
  e.stopPropagation();
  if (
    textField.textContent.trim() == "" &&
    textField.getElementsByTagName("img").length < 1
  ) {
    emptyDoc();
    return;
  }
  let content = `
 <div class="input-field">
 <label>Find:</label>
 <input id="findTxt">
 </div>
 <div class="input-field">
 <label>Replace:</label>
 <input id="replaceTxt">
 </div>
 <div class="btns">
 <button onclick="findText()">Find</button>
 <button onclick="clearHighlights()">Clear Find</button>
 <button onclick="findAndReplace()">Replace</button>
 </div>
 `;
  showDialog(content);
  document.getElementById("findTxt").focus();
});
function findText() {
  var reqTxt = document.getElementById("findTxt").value;
  var content = textField.innerHTML;
  clearHighlights();
  if (content.includes(reqTxt)) {
    let pages = document.querySelectorAll(".text-field");
    pages.forEach((page, index) => {
      if (page.innerHTML.includes(reqTxt)) {
        var regex = new RegExp(reqTxt, "g");
        var newContent = page.innerHTML.replace(
          regex,
          `<span class="highlight">${reqTxt}</span>`
        );
        page.innerHTML = newContent;
      }
    });
    var highlightedElement = textField.querySelector(".highlight");
    if (highlightedElement) {
      highlightedElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  } else {
    var alert = "There is no text related to " + reqTxt;
    document.getElementById("alert-msg").innerText = alert;
  }
}
function findAndReplace() {
  var reqTxt = document.getElementById("findTxt").value;
  var repTxt = document.getElementById("replaceTxt").value;
  var content = textField.innerHTML;
  if (content.includes(reqTxt)) {
    var regex = new RegExp(reqTxt, "g");
    var newContent = content.replace(regex, repTxt);
    textField.innerHTML = newContent;
  } else {
    var alert = "There is no text related to " + reqTxt;
    document.getElementById("alert-msg").innerText = alert;
  }
}
function clearHighlights() {
  textField.innerHTML = textField.innerHTML.replace(
    /<span class="highlight">|<\/span>/g,
    ""
  );
}
// ------------------------------------------------------
pageSetup.addEventListener("click", (e) => {
  e.stopPropagation();
  let margLeft = 0.5;
  let margRight = 0.5;
  let margTop = 0.5;
  let margBottom = 0.5;
  let pageWidth = 8.5;
  let pageBackColor = "#FFFFFF";
  if (textField.style.paddingLeft) {
    margLeft = textField.style.paddingLeft.replace(/[^\d.]/g, "");
    margRight = textField.style.paddingRight.replace(/[^\d.]/g, "");
    margBottom = textField.style.paddingBottom.replace(/[^\d.]/g, "");
    margTop = textField.style.paddingTop.replace(/[^\d.]/g, "");
  }
  if (textField.style.width) {
    pageWidth = textField.style.width.replace(/[^\d.]/g, "");
  }
  let content = `
   <div class="text-content">Customize Your Page</div>
   <div class="text-content">Margin<sub>(inch)</sub></div>
   <div class="input-field">
    <label>Left</label>
    <input type="number" value="${margLeft}" step="0.1" id="marLeft" style="--width:50px;;">
    <label>Right</label>
    <input type="number" value="${margRight}" step="0.1" id="marRight" style="--width:50px;;">
   </div>
   <hr>
   <div class="input-field" style="--field-for:'hari';">
   <label>Top</label>
   <input type="number" value="${margTop}" step="0.1" id="marTop" style="--width:50px;;">
   <label>Bottom</label>
   <input type="number" value="${margBottom}" step="0.1" id="marBottom" style="--width:50px;;">
  </div>
  <div class="btns">
    <button onclick="pageFormat()">Change</button>
  </div>
  <div class="text-content">Page Format</div>
  <div class="input-field">
   <label>Page Size</label>
   <select id="pageSize">
    <option value="8.5*11" ${
      pageWidth == "8.5" ? "selected" : ""
    }>letter (8.5x11)</option>
    <option value="5.5*8.5" ${
      pageWidth == "5.5" ? "selected" : ""
    }>Statement (5.5x8.5)</option>
    <option value="11.69*16.54" ${
      pageWidth == "11.69" ? "selected" : ""
    }>A3 (11.69x16.54)</option>
    <option value="8.27*11.69" ${
      pageWidth == "8.27" ? "selected" : ""
    }>A4 (8.27x11.69)</option>
    <option value="5.83*8.27"  ${
      pageWidth == "5.83" ? "selected" : ""
    }>A5 (5.83x8.27)</option>
    </select>
  </div>
  <div class="input-field">
    <label>Background</label>
    <input type="color" value="${pageBackColor}" style="--width:50px;" id="pageBack">
  </div>
  `;
  showDialog(content);

  var pageSize = document.getElementById("pageSize");
  var pageBack = document.getElementById("pageBack");
  pageSize.addEventListener("change", (e) => {
    var page = e.target.value;
    let [width, height] = page.split("*");
    applyPageSize(width, height);
  });
  pageBack.addEventListener("change", (e) => {
    applyBackground(e.target.value);
  });
});

function pageFormat() {
  var margLeft = document.getElementById("marLeft").value;
  var margRight = document.getElementById("marRight").value;
  var margTop = document.getElementById("marTop").value;
  var margBottom = document.getElementById("marBottom").value;
  applyMargin(margLeft, margRight, margTop, margBottom);
}
function applyMargin(margLeft, margRight, margTop, margBottom) {
  let pages = document.querySelectorAll(".text-field");
  pages.forEach((page) => {
    page.style.paddingLeft = margLeft + "in";
    page.style.paddingRight = margRight + "in";
    page.style.paddingTop = margTop + "in";
    page.style.paddingBottom = margBottom + "in";
  });
}
function applyBackground(colorCode) {
  textField.style.backgroundColor = colorCode;
}
function applyPageSize(width, height) {
  var editor = document.querySelectorAll(".text-field");
  editor.forEach((edit) => {
    edit.style.width = width + "in";
  });

  let printStyle = document.getElementById("print-style");
  if (printStyle) {
    printStyle.remove();
  }
  printStyle = document.createElement("style");
  printStyle.id = "print-style";
  printStyle.innerHTML = `@page { size: ${width}in ${height}in; margin: 20mm; }`;
  document.head.appendChild(printStyle);
}

// ---------------------------------------------------------------------------------------------------
downloadBtn.addEventListener("click", saveDocument);
function saveDocument(e) {
  if (
    textField.textContent.trim() == "" &&
    textField.getElementsByTagName("img").length < 1
  ) {
    emptyDoc();
    return;
  }
  e.preventDefault();
  let content = `
      <div>
        <label for="fileName">File Name:</label>
        <input type="text" id="fileName">
        <select id="fileType">
         <option value=".doc">.doc</option>
         <option value=".pdf">.pdf</option>
         <option value=".jpeg">.jpeg</option>
         <option value=".html">.html</option>
         <option value=".txt">.txt</option>
        </select>
      </div>
      <div class="btns">
        <button onclick="saveFile()">Download</button>
      </div>
    `;
  showDialog(content);
  document.getElementById("fileName").focus();
}
function saveFile() {
  let fileName = document.getElementById("fileName").value;
  let fileType = document.getElementById("fileType").value;
  let textField = document.getElementById("text-field");
  let htmlContent = textField.innerHTML;

  switch (fileType) {
    case ".doc":
      saveAsDoc(textField.id, fileName);
      break;
    case ".txt":
      saveAsTxt(fileName);
      break;
    case ".pdf":
      saveAsPdf(fileName, textField);
      break;
    case ".jpeg":
      saveAsJpeg(fileName, textField);
      break;
    case ".html":
      saveAsHtml(fileName, htmlContent);
      break;
  }
  hideDialogueBox();
}

function saveAsDoc(elementId, fileName) {
  Export2Word(elementId, fileName);
}

function saveAsTxt(fileName) {
  let blob = new Blob([textField.textContent], { type: "text/html" });
  downloadBlob(fileName + ".txt", blob);
}

function saveAsPdf(fileName, element) {
  html2pdf(element, {
    filename: fileName + ".pdf",
    html2canvas: { scale: 2 },
    jsPDF: { orientation: "portrait" },
  });
}

function saveAsJpeg(fileName, element) {
  html2canvas(element).then(function (canvas) {
    canvas.toBlob(function (blob) {
      let link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}.jpg`;
      link.click();
    }, "image/jpeg");
  });
}

function saveAsHtml(fileName, htmlContent) {
  let blob = new Blob([htmlContent], { type: "text/html" });
  downloadBlob(fileName + ".html", blob);
}

function downloadBlob(fileName, blob) {
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// export / download document file
function Export2Word(element, filename = "") {
  var htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Document ${filename}</title>
        <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>100</w:Zoom>
            </w:WordDocument>
          </xml>
        <![endif]-->
      </head>
      <body>${document.getElementById(element).innerHTML}</body>
    </html>
  `;
  var blob = new Blob(["\ufeff", htmlContent], {
    type: "application/msword",
  });
  var url = URL.createObjectURL(blob);
  filename = filename ? filename + ".doc" : "document.doc";
  var downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

document.addEventListener("keydown", function (e) {
  if ((e.ctrlKey && e.key === "s")) {
    e.preventDefault();
    saveDocument(e);
  }
  if((e.ctrlKey && e.key === "p")){
    e.preventDefault();
    printTextField();
  }
  if ((e.ctrlKey && e.key === "c") || (e.ctrlKey && e.key === "x")) {
    if(preventCopy){
      e.preventDefault();
    }
  }
  if (
    ((e.ctrlKey || e.metaKey) &&
      e.shiftKey &&
      (e.key === "i" || e.key === "I")) ||
    (e.metaKey && e.shiftKey && (e.key === "i" || e.key === "I")) ||
    (e.ctrlKey && e.shiftKey && (e.key === "i" || e.key === "I")) ||
    (e.metaKey && e.shiftKey && (e.key === "i" || e.key === "I")) ||
    (e.metaKey && e.altKey && (e.key === "i" || e.key === "I")) ||
    e.key === "F12"
  ) {
    e.preventDefault();
     saveDocument(e);
  }

  if (e.key === "f" && e.ctrlKey) {
    findReplace.click();
    e.preventDefault();
  }
});
function removeWindow() {
  window.close();
}

let tableEdit = true;
const customMenu = document.getElementById("custom-menu");
document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("contextmenu", function (event) {
    dialogContainer.classList.remove("active");
    event.preventDefault();
    customMenu.innerHTML = "";
    let content = "";
    if (event.target.closest("#text-field")) {
      if (event.target.closest(".bar-chart")) {
        let charts = Array.from(this.document.querySelectorAll(".bar-chart"));
        let chart = event.target.closest(".bar-chart");
        let chartIndex = charts.indexOf(chart);
        content = `
        <li class="custom-menu-item" onclick="deleteChart(${chartIndex})">Delete Chart</li>
        <hr>
        `;
      }
      if (event.target.tagName === "HR"){
        let hr = event.target;
        let hrs = Array.from(textField.querySelectorAll("hr"));
        let hrIndex = hrs.indexOf(hr);
        content = `
        <li class="custom-menu-item" onclick="removeHr(${hrIndex})">Remove Line</li> <hr>`;
      }
      if (event.target.tagName === "IMG") {
        let image = event.target;
        let images = Array.from(textField.querySelectorAll("img"));
        let imageIndex = images.indexOf(image);
        content = `
        <li class="custom-menu-item" onclick="replaceImg(${imageIndex})">Replace Image</li>
        <li class="custom-menu-item" onclick="editImg(${imageIndex})">Edit Image</li>
        <li class="custom-menu-item" onclick="deleteImg(${imageIndex});">Delete Image</li>
        <hr>
        `;
      }
      if (checkTable(event)) {
        let tblId = event.target.parentElement;
        let tblBody = tblId.parentElement;
        let table = tblBody.parentElement;
        let tr = Array.from(tblBody.querySelectorAll("tr"));
        let rowIndex = tr.indexOf(tblId);
        let cellIndex = Array.from(tblId.children).indexOf(event.target);
        content = `
        ${
          !tableEdit
            ? ""
            : `
        <li class="custom-menu-item" onclick="changeTbl(${table.id}, 'addRow', ${rowIndex}, ${cellIndex})">Add Row</li>
        <li class="custom-menu-item" onclick="changeTbl(${table.id}, 'addCol', ${rowIndex}, ${cellIndex})">Add Column</li>
        <li class="custom-menu-item" onclick="changeTbl(${table.id}, 'delRow', ${rowIndex}, ${cellIndex})">Delete Row</li>
        <li class="custom-menu-item" onclick="changeTbl(${table.id}, 'delCol', ${rowIndex}, ${cellIndex})">Delete Column</li>
        `
        }
        <li class="custom-menu-item" onclick="changeTbl(${
          table.id
        }, 'delTbl', ${rowIndex}, ${cellIndex})">Delete Table</li>
        <hr>
        `;
      }
      content += `
        <li class="custom-menu-item" onclick="document.getElementById('boldBtn').click();">Bold <span>(ctrl+B)</span></li>
        <li class="custom-menu-item" onclick="document.getElementById('italicBtn').click();">Italic <span>(ctrl+I)</span></li>
        <li class="custom-menu-item" onclick="document.getElementById('underlineBtn').click();">Underline <span>(ctrl+U)</span></li>
        ${
          checkTable(event) || event.target.tagName === "IMG"
            ? ""
            : `<li class="custom-menu-item" onclick="document.getElementById('horizontalBtn').click();">Horizontal <span>(ctrl+H)</span></li>
        <hr>
        <li class="custom-menu-item" onclick="document.getElementById('attachImage').click();">Insert Image <span>(alt+I)</span></li>
        <li class="custom-menu-item" onclick="document.getElementById('insertLink').click();">Link <span>(ctrl+L)</span></li>
        <hr>
        <li class="custom-menu-item" onclick="document.getElementById('printDoc').click();">Print <span>(ctrl+p)</span></li>
        <li class="custom-menu-item" onclick="refreshSite()">Refresh Site <span class="fas fa-arrows-rotate"></span></li>
        `
        }
      `;
      customMenu.innerHTML = content;
    } else {
      let defaultContent = `
      <li class="custom-menu-item" onclick="document.getElementById('downloadBtn').click();">Save <span class="fas fa-save"></span></li>
      <li class="custom-menu-item" onclick="document.getElementById('openFile').click();">Open <span class="fas fa-file-import"></span></li>
      <li class="custom-menu-item" onclick="document.getElementById('printDoc').click();">Print <span class="fas fa-print"></span></li>
      <li class="custom-menu-item" onclick="document.getElementById('emailSend').click();">Send E-mail <span class="fas fa-envelope"></span></li>
      <hr>
      <li class="custom-menu-item" onclick="document.getElementById('pageSetup').click();">pageSetup <span class="fas fa-file-lines"></span></li>
      <li class="custom-menu-item" onclick="refreshSite()">Refresh Site <span class="fas fa-arrows-rotate"></span></li>
      `;
      customMenu.innerHTML = defaultContent;
    }
    customMenu.classList.add("show");
    customMenu.style.left = event.pageX + "px";
    customMenu.style.top = event.pageY + "px";
  });
  window.addEventListener("click", function () {
    customMenu.classList.remove("show");
  });
});
function checkTable(event) {
  return (
    event.target.tagName === "TABLE" ||
    event.target.tagName === "TR" ||
    event.target.tagName === "TH" ||
    event.target.tagName === "TD"
  );
}

// ---------------------------------------------------------
let borderColorChanged = true;
function editImg(index) {
  let image = textField.querySelectorAll("img")[index];
  let width = image.style.width;
  width = width.replace(/[^0-9]/g, "");
  let height = image.style.height;
  height = height.replace(/[^0-9]/g, "");
  let padding = image.style.padding;
  padding = padding.replace(/[^0-9]/g, "");
  let border = image.style.borderWidth;
  let borderType = image.style.borderStyle;
  let borderColor = image.style.borderColor;
  let ImgRadius = image.style.borderRadius;
  let objectFit = image.style.objectFit;
  let float = image.style.float;
  let boxShadow = image.style.boxShadow;
  let filter = image.style.filter;
  let content = `
  <div class="text-content">Edit Image</div>
  <div>
     <label>Width of Image:</label>
     <input type="number" value="${width}" id="widthImg" style="--width:50px;" step="2"/>
     <label>px</label>
  </div><br>
  <div>
     <label>Height of Image:</label>
     <input type="number" value="${height}" id="heightImg" style="--width:50px;" step="2"/>
     <label>px</label>
  </div><br>
  <div>
     <label>Padding of Image:</label>
     <input type="number" value="${padding}" id="paddImg" style="--width:50px;" step="2"/>
     <label>px</label>
  </div><br>
  <hr>
  <div>
  <label>border:</label>
  <input type="number" value="${
    border ? parseInt(border) : "0"
  }" id="borderVal" style="--width:50px;" step=".5"/>px
  <select id="borderType">
  <option value="none">none</option>
    <option value="solid"${
      borderType == "solid" ? "selected" : ""
    }>Solid</option>
    <option value="dashed" ${
      borderType == "dashed" ? "selected" : ""
    }>Dashed</option>
    <option value="dotted" ${
      borderType == "dotted" ? "selected" : ""
    }>Dotted</option>
    <option value="groove" ${
      borderType == "groove" ? "selected" : ""
    }>Groove</option>
    <option value="ridge" ${
      borderType == "ridge" ? "selected" : ""
    }>Ridge</option>
  </select>
 </div><br>
  <div class="input-field">
   <label>Border Color:</lable>
   <input type="color" value="${
     borderColor ? borderColor : ""
   }" id="borderColor" style="--width:50px;">
  </div>
  <div>
  <label>Radius:</label>
  <input type="number" value="${
    ImgRadius ? parseInt(ImgRadius) : "0"
  }" id="ImgRadius" style="--width:50px;" step="5"/>
  <label>px</label>
 </div><br>
  <hr>
  <div class="input-field">
   <label>Object Fit:</label>
   <select id="objectFit">
     <option value="initial" ${
       objectFit == "initial" ? "selected" : ""
     }>Initial</option>
     <option value="contain" ${
       objectFit == "contain" ? "selected" : ""
     }>Contain</option>
     <option value="cover" ${
       objectFit == "cover" ? "selected" : ""
     }>Cover</option>
     <option value="fill" ${objectFit == "fill" ? "selected" : ""}>Fill</option>
     <option value="none" ${objectFit == "none" ? "selected" : ""}>None</option>
   </select>
  </div>
  <div class="input-field">
   <label>Float:</label>
   <select id="floatImg">
     <option value="none" ${float == "none" ? "selected" : ""}>None</option>
     <option value="left" ${float == "left" ? "selected" : ""}>Left</option>
     <option value="right" ${float == "right" ? "selected" : ""}>Right</option>
   </select>
  </div>
  <div style="display:flex; justify-content:space-between; align-items:center;">
  <label>Shadow:</label>
  <select id="imgShadow">
    <option value="none">None</option>
    <option value="inside" ${filter ? "selected" : ""}>Inside</option>
    <option value="outside" ${boxShadow ? "selected" : ""}>Outside</option>
  </select>
  <input type="color" id="shadowColor" value="#4444dd" style="width: 50px;">
 </div>
  <hr>
  <div class="btns">
   <button onclick="changeOnImg(${index})">Done</div>
  </div>
 `;
  showDialog(content);
  document.getElementById("borderColor").addEventListener("change", (e) => {
    borderColorChanged = true;
  });
}
function changeOnImg(id) {
  let image = textField.querySelectorAll("img")[id];
  let imgWidth = document.getElementById("widthImg").value;
  let imgHeight = document.getElementById("heightImg").value;
  let padding = document.getElementById("paddImg").value;
  let objectFit = document.getElementById("objectFit").value;
  let float = document.getElementById("floatImg").value;
  let border = document.getElementById("borderVal").value;
  let borderType = document.getElementById("borderType").value;
  let imgShadow = document.getElementById("imgShadow").value;
  let shadowColor = document.getElementById("shadowColor").value;
  switch (imgShadow) {
    case "inside":
      image.style.filter = `drop-shadow(0 0 4px ${shadowColor})`;
      break;
    case "outside":
      image.style.boxShadow = `0 2px 4px 0 ${shadowColor}`;
      break;
    default:
      image.style.filter = `none`;
      image.style.boxShadow = `none`;
  }
  if (borderColorChanged) {
    let borderColor = document.getElementById("borderColor").value;
    image.style.borderColor = `${borderColor}`;
  }
  let ImgRadius = document.getElementById("ImgRadius").value;
  image.style.width = `${imgWidth}%`;
  image.style.height = `${imgHeight}px`;
  image.style.padding = `${padding}px`;
  image.style.objectFit = `${objectFit}`;
  image.style.float = `${float}`;
  image.style.borderWidth = `${border}px`;
  image.style.borderStyle = `${borderType}`;
  image.style.borderRadius = `${ImgRadius}px`;
  borderColorChanged = false;
}
function deleteImg(index) {
  textField.querySelectorAll("img")[index].remove();
}
// --------------------------------------------------------
function removeHr(index){
  textField.querySelectorAll("hr")[index].remove();
}
// --------------------------------------------
function deleteChart(index) {
  textField.querySelectorAll(".bar-chart")[index].remove();
}
// ---------------------------------------------------------

function changeTbl(e, side, rowIndex, cellIndex) {
  let table = document.getElementById(e.id);
  let tblRow = table.querySelectorAll("tr");
  if (tblRow.length < 3) {
    tableEdit = false;
    return;
  }
  let tblCol = tblRow[tblRow.length - 1].querySelectorAll("td");
  let padding = tblCol[0].style.padding;
  let tblBody = table.getElementsByTagName("tbody")[0];
  switch (side) {
    case "addRow":
      addRow(tblCol.length, padding, tblBody, rowIndex);
      break;
    case "addCol":
      addCol(tblRow, padding, cellIndex);
      break;
    case "delRow":
      delRow(tblBody, rowIndex);
      break;
    case "delCol":
      delCol(tblRow, cellIndex);
      break;
    case "delTbl":
      delTbl(table);
      break;
  }
}
function addRow(colCount, padding, tblBody, rowIndex) {
  let newRow = document.createElement("tr");
  for (let i = 0; i < colCount; i++) {
    let newCell = document.createElement("td");
    newCell.style.padding = padding;
    newCell.innerHTML = "&nbsp;";
    newRow.appendChild(newCell);
  }
  tblBody.insertBefore(newRow, tblBody.children[rowIndex + 1]);
}

function addCol(tblRow, padding, cellIndex) {
  tblRow.forEach((tr) => {
    let newCell;
    if (tr.querySelectorAll("th").length > 0) {
      newCell = document.createElement("th");
    } else {
      newCell = document.createElement("td");
    }
    newCell.style.padding = padding;
    newCell.innerHTML = "&nbsp;";
    tr.insertBefore(newCell, tr.children[cellIndex + 1]);
  });
}

function delRow(tblBody, rowIndex) {
  if (rowIndex >= 0 && rowIndex < tblBody.children.length) {
    tblBody.removeChild(tblBody.children[rowIndex]);
  }
}

function delCol(tblRow, cellIndex) {
  tblRow.forEach((tr) => {
    if (cellIndex >= 0 && cellIndex < tr.children.length) {
      tr.removeChild(tr.children[cellIndex]);
    }
  });
}
function delTbl(table) {
  document.getElementById(table.id).remove();
}

// ---------------------------------------------------------------------------------------
localSave.addEventListener("click", (e) => {
  if (
    textField.textContent.trim() == "" &&
    textField.getElementsByTagName("img").length < 1
  ) {
    emptyDoc();
    return;
  }
  e.preventDefault();
  let content = `
  <div class="text-content">Save your file Locally.</div>
  <div class="input-field">
    <label>File Name:</label>
   <input id="localFileName">
 </div>
  <div class="btns">
   <button onclick="saveLocally()">Save</button>
  </div>
 `;
  showDialog(content);
  document.getElementById("localFileName").focus();
});
function saveLocally() {
  let localFileName = document.getElementById("localFileName").value;
  if (localFileName.trim() == "") {
    document.getElementById(
      "alert-msg"
    ).textContent = `File name cannot be empty.`;
    return;
  }
  let checkFile = JSON.parse(localStorage.getItem(localFileName));
  if (checkFile) {
    let alert = `This fileName is already exist`;
    document.getElementById("alert-msg").textContent = alert;
    return;
  }
  localStorage.setItem(localFileName, JSON.stringify(textField.innerHTML));
  hideDialogueBox();
}
const localFile = document.getElementById("localFile");
localFile.addEventListener("click", (e) => {
  e.preventDefault();
  getLocalData();
});
function getLocalData() {
  let content = `
 <div class="text-content">
   Saved Files
  </div>
  <ul>`;
  if (localStorage.length > 0) {
    for (let i = 0; i < localStorage.length; i++) {
      content += `<li style="cursor:pointer;">
        <input type="checkBox" value="${localStorage.key(i)}" id="filesId">
        <a onclick="openLocalFile('${localStorage.key(
          i
        )}')"><i class="fas fa-fw fa-file"></i>${localStorage.key(i)}</a>
        <span onclick="deleteLocalFIle('${localStorage.key(
          i
        )}')" class="fas fa-trash" style="color:red;cursor:pointer;"></span>
        </li> `;
    }
    content += ` </ul>
    <div class="btns"><button class="red" id="deleteMultiple">Deltete Selected</button>`
  } else {
    content += `<li style="color:red;">Empty database.</li></ul>`;
  }
  showDialog(content);
  document.getElementById("deleteMultiple").addEventListener("click", (e) => {
    let id = [];
    let checks = document.querySelectorAll("#filesId");
    for (let i = 0; i < checks.length; i++) {
      if (checks[i].checked) {
        id.push(checks[i].value);
      }
    }
    deleteSelectedFiles(id);
  });
}

function openLocalFile(name) {
  let findFile = JSON.parse(localStorage.getItem(name));
  if (findFile) {
    textField.innerHTML = findFile;
    hideDialogueBox();
  }
}
function deleteLocalFIle(name) {
  let file = JSON.parse(localStorage.getItem(name));
  if (file) {
    localStorage.removeItem(name);
    getLocalData();
  }
}
function deleteSelectedFiles(files) {
  files.forEach((file) => {
    localStorage.removeItem(file);
    getLocalData();
  });
}
window.addEventListener("load", (e) => {
  let textFieldContent = JSON.parse(sessionStorage.getItem("textContent"));
  if (textFieldContent) {
    textField.innerHTML = JSON.parse(sessionStorage.getItem("textContent"));
    sessionStorage.removeItem("textContent");
  }
  var content = sessionStorage.getItem('content');
  if (content) {
    textField.innerHTML = content;
    sessionStorage.removeItem('content');
  }
});
window.addEventListener("beforeunload", (e) => {
  sessionStorage.setItem("textContent", JSON.stringify(textField.innerHTML));
});

// -------------------------------------------------------------------------------
const ourDetails = document.getElementById("ourDetails");
ourDetails.addEventListener("click", (e) => {
  let content = `
<div style="width:500px; min-width:100%;">
  <div class="text-content" style="font-weight:900;">About Us</div>
  <p>
    This document editor is designed to meet your document editing and creation needs. This site was built by <a href="https://darpanadhikari.com.np">Darpan Adhikari</a>.
  </p>
  <br><hr>
  <div class="text-content">Our Services</div>
  <ol style="display:flex; flex-direction:column; gap:5px; padding:10px;">
    <li>Offline document activities</li>
    <li>Edit .txt files and Word documents</li>
    <li>Edit and send emails directly from the platform</li>
    <li>Local Storage for future use</li>
    <li>Incorporate tables, images, and bar charts</li>
    <li>Access the source code of your edited documents</li>
    <li>Create word-limited documents such as essays and speeches</li>
    <li>Edit uploaded images and tables</li>
    <li>Comprehensive features to complete any document</li>
  </ol>
</div>
 `;
  showDialog(content);
});
// -------------------------show dialogue box---------------------------------------
function showDialog(content) {
  if (document.getElementById("custom-menu").classList.contains("show")) {
    document.getElementById("custom-menu").classList.remove("show");
  }
  document.getElementById("alert-msg").textContent = "";
  document.getElementById("dialogueMainContent").innerHTML = content;
  dialogContainer.classList.add("active");

  dialogContainer.addEventListener("mousedown", startDrag);
}
// ------------------------------------------------------------------
function startDrag(e) {
  if (
    e.target.tagName === "LABEL" ||
    e.target.tagName === "INPUT" ||
    e.target.tagName === "LI" ||
    e.target.tagName === "IMG"
  ) {
    return;
  }
  const initialX = e.clientX;
  const initialY = e.clientY;
  const initialLeft = dialogContainer.offsetLeft;
  const initialTop = dialogContainer.offsetTop;

  function onDrag(e) {
    const deltaX = e.clientX - initialX;
    const deltaY = e.clientY - initialY;

    dialogContainer.style.left = `${initialLeft + deltaX}px`;
    dialogContainer.style.top = `${initialTop + deltaY}px`;
  }
  function stopDrag() {
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
  }

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
}

function hideDialogueBox() {
  dialogContainer.classList.remove("active");
  dialogContainer.removeEventListener("mousedown", startDrag);
}

dialogContainer.addEventListener("mousedown", startDrag);
function emptyDoc() {
  let content = `
    <div class="text-content">Your document is empty.</div>
    `;
  showDialog(content);
}

// -------------------------------------------------------------
const inbuiltFormat = document.getElementById("inbuiltFormat");
inbuiltFormat.addEventListener("click",(e)=>{
  e.preventDefault();
  e.stopPropagation();
  let content = `
  <div class="text-content">Choose Template</div>
  <div class="templates">
    <picture onclick="filterTemplate('letter')"><img src="templates/letter.jpg" alt=""><span>Letter</span></picture>
    <picture onclick="filterTemplate('businessLetter')"><img src="templates/business letter.jpg" alt=""><span>Business Letter</span></picture>
    <picture onclick="filterTemplate('resume')"><img src="templates/resume.jpg" alt=""><span>Resume</span></picture>
    <picture onclick="filterTemplate('swissResume')"><img src="templates/swiss resume.jpg" alt=""><span>Swiss Resume</span></picture>
    <picture onclick="filterTemplate('modernResume')"><img src="templates/modern resume.jpg" alt=""><span>Modern Resume</span></picture>
    <picture onclick="filterTemplate('essay')"><img src="templates/essay.jpg" alt=""><span>Essay</span></picture>
    <picture onclick="filterTemplate('newsLetter')"><img src="templates/newsletter.jpg" alt=""><span>News Letter</span></picture>
    <picture onclick="filterTemplate('report')"><img src="templates/report.jpg" alt=""><span>Report</span></picture>
    <picture onclick="filterTemplate('recipe')"><img src="templates/recipe.jpg" alt=""><span>Recipe</span></picture>
  </div>
  `;
  showDialog(content);
});
// --------------------------------------------
const filterTemplate = (templateKey) => {
  var content = pageTemplate[templateKey];
 if(content){
  if (
    textField.textContent.trim() == "" &&
    textField.getElementsByTagName("img").length < 1
  ) {
    textField.innerHTML = content;
    hideDialogueBox();
  }else{
    sessionStorage.setItem('content', content);
    hideDialogueBox();
    window.open(window.location.href, "_blank");
  }
 }
};

// ------------------------------------------------------
printDoc.addEventListener("click", (e) => {
  e.stopPropagation();
  printTextField();
});

function printTextField() {
  hideDialogueBox();
  hideDialogueBox();
  customMenu.classList.remove("active");

  const dimensions = {
    '8.5': '11',
    '5.5': '8.5',
    '11.69': '16.54',
    '8.27': '11.69',
    '5.83': '8.27'
  };

  let width = (textField.offsetWidth || 595) / 96;
  width = width.toFixed(2);

  const height = dimensions[width] || (textField.offsetHeight || 842) / 96;
  const textFieldContent = textField.innerHTML;

  // Get computed styles for table with customTbl class and its children
  const table = textField.querySelector('table.customTbl');
  let tableStyles = '';
  if (table) {
    const tableComputedStyle = window.getComputedStyle(table);
    tableStyles += 'table.customTbl {';
    for (let i = 0; i < tableComputedStyle.length; i++) {
      const prop = tableComputedStyle[i];
      tableStyles += `${prop}: ${tableComputedStyle.getPropertyValue(prop)}; `;
    }
    tableStyles += '} ';

    const tableCells = table.querySelectorAll('th, td');
    tableCells.forEach(cell => {
      const cellComputedStyle = window.getComputedStyle(cell);
      tableStyles += 'th, td {';
      for (let i = 0; i < cellComputedStyle.length; i++) {
        const prop = cellComputedStyle[i];
        tableStyles += `${prop}: ${cellComputedStyle.getPropertyValue(prop)}; `;
      }
      tableStyles += '} ';
    });
  }

  const printWindow = window.open('', '', `height=${842},width=${695}`);
  printWindow.document.write(`
    <html>
      <head>
        <title>Mero Document</title>
        <style>
          @media print {
            @page { 
              size: ${width}in ${height}in; 
              margin: 20px; 
            }
            body {
              margin: 0;
            }
          }
          .text-field {
            margin: 20px;
          }
          .text-field table.customTbl th{
            background: #666; 
            color: #fff; 
          }
          .text-field table.customTbl td,
          .text-field table.customTbl th{
            padding: 8px;
          }
          .text-field table tr:nth-child(odd) {
            background-color: var(--td-back);
          }
          .text-field img{
            max-width: 100%;
          }
        </style>
      </head>
      <body>
        <div class="text-field">
          ${textFieldContent}
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();

  printWindow.onload = function() {
    printWindow.print();
    printWindow.close();
  };
}
// ------------------------------------------
function refreshSite(){
  const event = new KeyboardEvent('keydown', {
      key: 'r',
      code: 'KeyR',
      ctrlKey: true,
      altKey: true,
      bubbles: true
  });
  document.dispatchEvent(event);
}
