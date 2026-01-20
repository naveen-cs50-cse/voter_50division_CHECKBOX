const API_BASE =
  window.location.port === "5500"
    ? "http://127.0.0.1:5000"
    : window.location.origin;




const searchType = document.getElementById("searchType");
const input = document.getElementById("searchInput");
const desktopTbody = document.getElementById("desktopResults");
const mobileContainer = document.getElementById("mobileResults");
const countEl = document.getElementById("count");

/* Change placeholder */
searchType.addEventListener("change", () => {
  input.placeholder =
    searchType.value === "epic"
      ? "Enter EPIC number (e.g. RUA3498011)"
      : "Enter house number (e.g. 12-255/1)";
});

/* MAIN SEARCH */
async function searchVoter() {
  const type = searchType.value;
  const value = input.value.trim();

  if (!value) {
    alert("Enter EPIC or House Number");
    return;
  }

  const url =
    type === "epic"
      ? `${API_BASE}/api/voters/epic/${value.toUpperCase()}`
      : `${API_BASE}/api/voters/house/${encodeURIComponent(value)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      renderAll([]);
      return;
    }

    const data = await res.json();

    let voters = [];
    if (type === "epic") {
      voters = data ? [data] : [];
    } else {
      voters = data.voters || [];
    }

    renderAll(voters);
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

/* RENDER BOTH DESKTOP + MOBILE */
function renderAll(voters) {
  desktopTbody.innerHTML = "";
  mobileContainer.innerHTML = "";
  countEl.textContent = voters.length;

  if (!voters.length) {
    desktopTbody.innerHTML = `
      <tr>
        <td colspan="8" class="empty">No records found</td>
      </tr>`;
    return;
  }

  voters.forEach((raw, index) => {
    const v = normalizeVoter(raw);

    /* DESKTOP ROW */
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>
        <div class="name-en">${v.name_en}</div>
        <div class="name-te">${v.name_te}</div>
      </td>
      <td>
        <div class="rel-en">${v.relation_en}</div>
        <div class="rel-te">${v.relation_te}</div>
      </td>
      <td>${v.epic}</td>
      <td>${v.age}</td>
      <td>${v.sex}</td>
      <td>${v.house}</td>
      <td class="addr">${v.address}</td>

  <td>
    <select
      class="vote-select ${v.vote_status}"
      onchange="updateVoteStatus('${v.epic}', this.value)"
    >
      <option value="undecided" ${v.vote_status === "undecided" ? "selected" : ""}>Undecided</option>
      <option value="our" ${v.vote_status === "our" ? "selected" : ""}>Our</option>
      <option value="opp" ${v.vote_status === "opp" ? "selected" : ""}>Opp</option>
    </select>
  </td>
        `;
    desktopTbody.appendChild(tr);

    /* MOBILE CARD */
    const card = document.createElement("div");
    card.className = "voter-card";
    card.innerHTML = `
      <div class="card-name">
        <span class="name-te">${v.name_te}</span>
        <span class="name-en">${v.name_en}</span>
      </div>

      <div class="card-row"><b>Relation:</b> ${v.relation_te} (${v.relation_en})</div>
      <div class="card-row"><b>EPIC:</b> ${v.epic}</div>
      <div class="card-row"><b>Age / Sex:</b> ${v.age} / ${v.sex}</div>
      <div class="card-row"><b>House:</b> ${v.house}</div>
      <div class="card-row"><b>Address:</b> ${v.address}</div>


<div class="card-row">
  <b>Vote:</b>
  <select
    class="vote-select ${v.vote_status}"
    onchange="updateVoteStatus('${v.epic}', this.value)"
  >
    <option value="undecided" ${v.vote_status === "undecided" ? "selected" : ""}>Undecided</option>
    <option value="our" ${v.vote_status === "our" ? "selected" : ""}>Our</option>
    <option value="opp" ${v.vote_status === "opp" ? "selected" : ""}>Opp</option>
  </select>
</div>


    `;
    mobileContainer.appendChild(card);
  });
}

/* NORMALIZE BACKEND DATA */
function normalizeVoter(v) {
  return {
    name_en: v["Name"] || "",
    name_te: v.name_te || "",

    relation_en: v["Relation Name"] || "",
    relation_te: v.relation_te || "",

    epic: v.epic_clean || "",
    age: v.Age || "",
    sex: v.Sex || "",

    house: v.hno_filtered || "",
    address: v.Address || "",

    vote_status: v.vote_status || "undecided"
  };
}

/* ENTER KEY SUPPORT */
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchVoter();
});



async function updateVoteStatus(epic, status) {
  try {
    await fetch(`${API_BASE}/api/voters/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ epic, status })
    });
  } catch (e) {
    alert("Failed to save vote status");
  }
}


