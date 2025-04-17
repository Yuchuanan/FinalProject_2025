document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const designerFilter = document.getElementById('designer-filter');
  const yearFilter = document.getElementById('year-filter');
  const resetBtn = document.getElementById('reset-filters');
  const items = document.querySelectorAll('.catalog-item');

  function filterItems() {
    const query = searchInput.value.toLowerCase();
    const designer = designerFilter.value;
    const year = yearFilter.value;

    items.forEach(item => {
      const name = item.dataset.name.toLowerCase();
      const itemDesigner = item.dataset.designer;
      const itemYear = item.dataset.year;

      const matchesName = name.includes(query);
      const matchesDesigner = designer === "" || itemDesigner === designer;
      const matchesYear = year === "" || itemYear.startsWith(year.slice(0, 3));

      item.style.display = (matchesName && matchesDesigner && matchesYear) ? "block" : "none";
    });
  }

  searchInput.addEventListener('input', filterItems);
  designerFilter.addEventListener('change', filterItems);
  yearFilter.addEventListener('change', filterItems);
  resetBtn.addEventListener('click', () => {
    searchInput.value = "";
    designerFilter.value = "";
    yearFilter.value = "";
    filterItems();
  });
});
