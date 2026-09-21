const bundles = [
  {id:"xs", name:"X-Small", items:"2 shirts + 1 pair of pants", price:15},
  {id:"s", name:"Small", items:"3 shirts + 2 pairs of pants", price:25},
  {id:"m", name:"Medium", items:"5 shirts + 3 pairs of pants", price:40},
  {id:"l", name:"Large", items:"7 shirts + 5 pairs of pants", price:60},
  {id:"xl", name:"X-Large", items:"10 shirts + 7 pairs of pants", price:80}
];

const states = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];

const grid = document.getElementById("bundleGrid");
const backdrop = document.getElementById("modalBackdrop");
const form = document.getElementById("orderForm");
const stateSelect = document.querySelector('select[name="state"]');

states.forEach(s => {
  const option = document.createElement("option");
  option.value = s;
  option.textContent = s;
  stateSelect.appendChild(option);
});

bundles.forEach(bundle => {
  const card = document.createElement("article");
  card.className = "bundle-card";
  card.tabIndex = 0;
  card.innerHTML = `<p class="eyebrow">${bundle.id === "m" ? "Most treasure" : "Thrift bundle"}</p>
    <h3>${bundle.name}</h3>
    <div class="items">${bundle.items}</div>
    <div class="price">$${bundle.price}</div>
    <div class="select">Customize this bundle →</div>`;
  card.addEventListener("click", () => openBundle(bundle));
  card.addEventListener("keydown", e => { if(e.key === "Enter" || e.key === " ") openBundle(bundle); });
  grid.appendChild(card);
});

function openBundle(bundle) {
  form.reset();
  document.getElementById("bundleId").value = bundle.id;
  document.getElementById("bundlePrice").value = bundle.price;
  document.getElementById("selectedBundle").textContent = `${bundle.name} — ${bundle.items} — $${bundle.price}`;
  document.getElementById("summaryBundle").textContent = `${bundle.name} — ${bundle.items}`;
  document.getElementById("summaryBase").textContent = `$${bundle.price}`;
  updateTotal();
  backdrop.classList.add("open");
  backdrop.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  backdrop.classList.remove("open");
  backdrop.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}

document.getElementById("closeModal").addEventListener("click", closeModal);
backdrop.addEventListener("click", e => { if(e.target === backdrop) closeModal(); });
document.addEventListener("keydown", e => { if(e.key === "Escape" && backdrop.classList.contains("open")) closeModal(); });

document.querySelectorAll('input[name="accessories"]').forEach(input => {
  input.addEventListener("change", updateTotal);
});

function updateTotal() {
  const base = Number(document.getElementById("bundlePrice").value || 0);
  const selected = document.querySelector('input[name="accessories"]:checked');
  const accessory = selected ? Number(selected.dataset.price) : 0;
  document.getElementById("summaryAccessory").textContent = `$${accessory}`;
  document.getElementById("summaryAccessoryName").textContent = selected?.value || "Accessories";
  document.getElementById("summaryTotal").textContent = `$${base + accessory}`;
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const zip = form.elements.zip.value.trim();
  const email = form.elements.email.value.trim();
  const status = document.getElementById("formStatus");

  if(!/^\d{5}(-\d{4})?$/.test(zip)) {
    status.textContent = "Please enter a valid US ZIP code.";
    form.elements.zip.focus();
    return;
  }
  if(!email.includes("@")) {
    status.textContent = "Please enter a valid email address.";
    form.elements.email.focus();
    return;
  }

  status.textContent = "Your order details are ready. Stripe checkout and email delivery will be connected in the next setup step.";
});

document.querySelectorAll('nav a[href^="#"]').forEach(a => {
  a.addEventListener("click", () => {
    if(backdrop.classList.contains("open")) closeModal();
  });
});
