// script.js

let allPrompts = []; // 保存所有提示词数据

document.addEventListener("DOMContentLoaded", function() {
  fetch("prompts.json")
    .then(response => response.json())
    .then(data => {
      allPrompts = data;
      renderPrompts(allPrompts);
    })
    .catch(error => {
      console.error("加载提示词数据失败：", error);
    });
  
  // 监听搜索框输入
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function() {
      const keyword = searchInput.value.toLowerCase();
      const filteredPrompts = allPrompts.filter(prompt => {
        const textMatch = prompt.text.toLowerCase().includes(keyword);
        const tagsMatch = prompt.tags.some(tag => tag.toLowerCase().includes(keyword));
        return textMatch || tagsMatch;
      });
      renderPrompts(filteredPrompts);
    });
  }
});

function renderPrompts(prompts) {
  const container = document.getElementById("prompt-list");
  container.innerHTML = ""; // 清空之前渲染的内容
  prompts.forEach(prompt => {
    const card = document.createElement("div");
    card.className = "card";

    // prompt 内容
    const promptText = document.createElement("div");
    promptText.className = "prompt-text";
    promptText.textContent = prompt.text;
    card.appendChild(promptText);

    // 标签展示
    const tagsDiv = document.createElement("div");
    tagsDiv.className = "tags";
    prompt.tags.forEach(tag => {
      const tagSpan = document.createElement("span");
      tagSpan.textContent = tag;
      tagsDiv.appendChild(tagSpan);
    });
    card.appendChild(tagsDiv);

    // 收藏按钮
    const favButton = document.createElement("button");
    favButton.textContent = isFavorited(prompt.id) ? "已收藏" : "收藏";
    favButton.addEventListener("click", function() {
      toggleFavorite(prompt.id, favButton);
    });
    card.appendChild(favButton);

    container.appendChild(card);
  });
}

function isFavorited(id) {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  return favorites.includes(id);
}

function toggleFavorite(id, button) {
  let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
    button.textContent = "收藏";
  } else {
    favorites.push(id);
    button.textContent = "已收藏";
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
}