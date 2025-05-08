document.getElementById("login-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const matricula = document.getElementById("matricula").value.trim();

  if (matricula !== "") {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("votacao-section").style.display = "block";
  } else {
    alert("Digite uma matrícula válida.");
  }
});
function votar(candidato) {
  let votos = JSON.parse(localStorage.getItem("votos")) || {
    chapa1: 0,
    chapa2: 0,
    chapa3: 0
  };

  votos[candidato] += 1;

  localStorage.setItem("votos", JSON.stringify(votos));

  alert(`Seu voto para ${candidato} foi registrado com sucesso!`);
  document.getElementById("votacao-section").style.display = "none";
}
