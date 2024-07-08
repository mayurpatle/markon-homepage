function applyFormat(command) {
  switch (command) {
    case "bold":
      document.execCommand("bold");
      break;
    case "underline":
      document.execCommand("underline");
      break;
    case "italic":
      document.execCommand("italic");
      break;
  }
  updateMarkon();
}

function updateMarkon() {
  const editor = document.querySelector(".editor");
  const output = document.getElementById("output");
  const formattedText = editor.innerHTML;

  const markonText = formattedText
    .replace(/<b>(.*?)<\/b>/g, "#b[$1]#")
    .replace(/<strong>(.*?)<\/strong>/g, "#b[$1]#")
    .replace(/<u>(.*?)<\/u>/g, "#u[$1]#")
    .replace(/<i>(.*?)<\/i>/g, "#e[$1]#")
    .replace(/<em>(.*?)<\/em>/g, "#e[$1]#")
    .replace(/<br>/g, "#br#")
    .replace(/<a href="(.*?)">(.*?)<\/a>/g, "#link[$2, $1]#")
    .replace(/<ul>(.*?)<\/ul>/g, (match, p1) => {
      const items = p1
        .match(/<li>(.*?)<\/li>/g)
        .map((item) => item.replace(/<\/?li>/g, ""))
        .join(", ");
      return `#list[${items}]#`;
    })
    .replace(/<ol>(.*?)<\/ol>/g, (match, p1) => {
      const items = p1
        .match(/<li>(.*?)<\/li>/g)
        .map((item) => item.replace(/<\/?li>/g, ""))
        .join(", ");
      return `#list[${items}]#`;
    })
    .replace(/&nbsp;/g, " ") // removing non breaking space
    .replace(/<div>/g, "\n")
    .replace(/<\/div>/g, ""); // removing div

  output.textContent = markonText;
}

function highlightMarkon() {
  const editor = document.querySelector(".editor");
  const output = document.getElementById("output");

  const selection = window.getSelection();
  const selectedText = selection.toString();

  if (selectedText) {
    const formattedText = editor.innerHTML;

    const markonText = formattedText
      .replace(/<b>(.*?)<\/b>/g, "#b[$1]#")
      .replace(/<strong>(.*?)<\/strong>/g, "#b[$1]#")
      .replace(/<u>(.*?)<\/u>/g, "#u[$1]#")
      .replace(/<i>(.*?)<\/i>/g, "#e[$1]#")
      .replace(/<em>(.*?)<\/em>/g, "#e[$1]#")
      .replace(/<br>/g, "#br#")
      .replace(/<a href="(.*?)">(.*?)<\/a>/g, "#link[$2, $1]#")
      .replace(/<ul>(.*?)<\/ul>/g, (match, p1) => {
        const items = p1
          .match(/<li>(.*?)<\/li>/g)
          .map((item) => item.replace(/<\/?li>/g, ""))
          .join(", ");
        return `#list[${items}]#`;
      })
      .replace(/&nbsp;/g, " "); // Remove non-breaking spaces

    const highlightedMarkonText = markonText.replace(
      new RegExp(`(${escapeRegExp(selectedText)})`, "g"),
      '<span class="highlight">$1</span>'
    );

    output.innerHTML = highlightedMarkonText;
  } else {
    updateMarkon();
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
