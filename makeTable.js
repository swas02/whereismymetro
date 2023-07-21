function generateTable(jsonData) {
  let container = document.querySelector("#tableContainer");
  container.innerHTML = "";
  let table = document.createElement("table");
  table.id = "myTable";
  let colHeadName = Object.keys(jsonData[0]);
  let tableHead = document.createElement("thead");
  let tr = document.createElement("tr");
  colHeadName.forEach((e) => {
      let th = document.createElement("th");
      th.innerText = e;
      tr.appendChild(th);
  });
  tableHead.appendChild(tr);

  table.append(tr);

  jsonData.forEach((e) => {
      let tr = document.createElement("tr");
      let tableValue = Object.values(e);
      tableValue.forEach((e) => {
          let td = document.createElement("td");
          td.innerText = e.replaceAll('_', ' ');
          tr.appendChild(td);
      });
      table.appendChild(tr);
  });
  container.appendChild(table);
}