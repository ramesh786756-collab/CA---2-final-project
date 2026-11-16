(function () {
  // ---------- DATA ----------
  let items = [
    { id: '1', name: 'Acoustic guitar', price: 189.99, condition: 'used', description: 'Minor scratches, great sound', seller: 'Alex' },
    { id: '2', name: 'Ceramic planter set', price: 32.5, condition: 'unused', description: 'Set of 3, terracotta', seller: 'Mira' },
    { id: '3', name: 'Wireless headphones', price: 75.0, condition: 'used', description: 'Like new, with case', seller: 'Jamie' },
    { id: '4', name: 'Linen throw blanket', price: 44.0, condition: 'unused', description: 'Organic cotton, ivory', seller: 'Noor' }
  ];

  let activeFilter = 'all';

  // DOM elements
  const productGrid = document.getElementById('productGrid');
  const addBtn = document.getElementById('addItemBtn');
  const itemNameInput = document.getElementById('itemName');
  const itemPriceInput = document.getElementById('itemPrice');
  const itemConditionSelect = document.getElementById('itemCondition');
  const itemDescInput = document.getElementById('itemDesc');
  const visibleCountSpan = document.getElementById('visibleCount');
  const headerItemCountSpan = document.getElementById('headerItemCount');

  const sellerNames = ['Sam', 'Riley', 'Casey', 'Jordan', 'Taylor', 'Morgan', 'Avery', 'Parker'];
  function getRandomSeller() {
    return sellerNames[Math.floor(Math.random() * sellerNames.length)];
  }

  function generateId() {
    return Date.now() + '-' + Math.random().toString(36).substring(2, 8);
  }

  // ---------- RENDER ----------
  function render() {
    const filteredItems = activeFilter === 'all'
      ? items
      : items.filter(item => item.condition === activeFilter);

    visibleCountSpan.textContent = `Showing ${filteredItems.length} item${filteredItems.length !== 1 ? 's' : ''}`;
    headerItemCountSpan.textContent = items.length;

    if (filteredItems.length === 0) {
      productGrid.innerHTML = `
        <div class="empty-message">
          <i class="fas fa-box-open"></i>
          No items match this filter.<br> Try adding something or switch tabs.
        </div>
      `;
      return;
    }

    let cardsHtml = '';
    filteredItems.forEach(item => {
      const conditionClass = item.condition === 'used' ? 'used' : '';
      const conditionLabel = item.condition === 'used' ? 'Used' : 'Unused';
      const priceFormatted = item.price.toFixed(2);
      const desc = item.description && item.description.trim()
        ? item.description
        : (item.condition === 'used' ? 'gently used' : 'brand new');

      cardsHtml += `
        <div class="product-card" data-id="${item.id}">
          <div class="card-header">
            <span class="condition-badge ${conditionClass}">${conditionLabel}</span>
            <span class="price-tag">$${priceFormatted}</span>
          </div>
          <div class="product-name">${escapeHtml(item.name)}</div>
          <div class="product-desc">${escapeHtml(desc)}</div>
          <div class="card-footer">
            <span class="seller-info"><i class="fas fa-user"></i> ${escapeHtml(item.seller || 'You')}</span>
            <button class="delete-btn" data-id="${item.id}" title="remove listing"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
      `;
    });

    productGrid.innerHTML = cardsHtml;

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteItemById(btn.dataset.id);
      });
    });
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ---------- ACTIONS ----------
  function deleteItemById(id) {
    items = items.filter(item => item.id !== id);
    render();
  }

  function addNewItem() {
    const name = itemNameInput.value.trim();
    const priceRaw = itemPriceInput.value.trim();
    const condition = itemConditionSelect.value;
    const description = itemDescInput.value.trim();

    if (!name) {
      alert('Please enter an item name.');
      itemNameInput.focus();
      return;
    }
    if (!priceRaw) {
      alert('Please enter a price.');
      itemPriceInput.focus();
      return;
    }
    const priceNum = parseFloat(priceRaw);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Price must be a positive number.');
      itemPriceInput.value = '';
      itemPriceInput.focus();
      return;
    }

    const newItem = {
      id: generateId(),
      name: name,
      price: priceNum,
      condition: condition,
      description: description || (condition === 'used' ? 'gently used' : 'brand new'),
      seller: getRandomSeller()
    };

    items.push(newItem);

    itemNameInput.value = '';
    itemPriceInput.value = '';
    itemDescInput.value = '';
    itemNameInput.focus();

    if (activeFilter !== 'all' && activeFilter !== condition) {
      activeFilter = 'all';
      document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === 'all') {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    render();
  }

  // ---------- EVENT LISTENERS ----------
  addBtn.addEventListener('click', addNewItem);

  const inputs = [itemNameInput, itemPriceInput, itemDescInput];
  inputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addNewItem();
      }
    });
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      render();
    });
  });

  render();
})();