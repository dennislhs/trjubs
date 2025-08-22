//confing supabase
const supabase_url = "https://qphxpdbpeyngrunuxpjw.supabase.co";
const supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaHhwZGJwZXluZ3J1bnV4cGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MzA0MzksImV4cCI6MjA3MTIwNjQzOX0.NMXBahgj5teLre42_rFEhWvdwIqKPxf6tHP0gCnx7Zw"

const supabase = window.supabase.createClient(supabase_url, supabase_key);

function abrirFormulario(id){
    document.getElementById(id).classList.toggle("oculto");
}

async function adicionarCaminhao(event){
    event.preventDefault();

    const nome = document.getElementById("nomeCaminhao").value;
    const placa = document.getElementById("placaCaminhao").value;

    const { data, error } = await supabase
        .from("caminhoes")
        .insert([{ nome: nome, placa: placa }])

    if (error){
        alert("Erro ao adicionar caminhão: " + error.message);
    } else{
        alert("Caminhão adicionado com sucesso!")
        document.getElementById("formCaminhao").reset();
        listarCaminhoes();
    }
}

async function listarCaminhoes(){
    const {data, error} = await supabase
        .from('caminhoes')
        .select('*');

    if (error){
        document.getElementById("listaCaminhoes").innerHTML = "<p>Erro ao carregar caminhões.</p>";
    } else{
        let html =`
            <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Placa</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(c => {
            html += `
                <tr>
                    <td>${c.id}</td>
                    <td>${c.nome}</td>
                    <td>${c.placa}</td>
                </tr>
            `;
        });
        html += `
                </tbody>
            </table>
        `;
        
        document.getElementById("listaCaminhoes").innerHTML = html;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    listarCaminhoes();

    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    if (menuToggle && menu) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('show');
        });
    }
});