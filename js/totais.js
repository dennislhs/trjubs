const supabase_url = "https://qphxpdbpeyngrunuxpjw.supabase.co";
const supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaHhwZGJwZXluZ3J1bnV4cGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MzA0MzksImV4cCI6MjA3MTIwNjQzOX0.NMXBahgj5teLre42_rFEhWvdwIqKPxf6tHP0gCnx7Zw"

const supabase = window.supabase.createClient(supabase_url, supabase_key);

function abrirFormulario (id){
    document.getElementById(id).classList.toggle("oculto");
}

async function carregarObras(id_empresa = null){
    
    let query = supabase.from("obras").select("*");

    if (id_empresa){
        query = query.eq("id_empresa", id_empresa);
    }

    const {data, error} = await query;

    if (error){
        console.error("Erro ao carregar Obras:", error);
        return;
    }

    let filtroObra = document.getElementById("filtroObra");
    filtroObra.innerHTML = '<option value="">Obras</option>';

    data.forEach(obras =>{

        let option = document.createElement('option');
        option.value = obras.id;
        option.textContent = obras.nome;
        filtroObra.appendChild(option);

    });
}

async function carregarEmpresas() {

    const {data, error} = await supabase
        .from("empresas")
        .select("*");
    
    if (error) {
        console.error("Erro ao carregar empresas:", error);
        return;
    }

    let filtroEmpresa = document.getElementById("filtroEmpresa");

    data.forEach(empresa =>{

        let option = document.createElement("option");
        option.value = empresa.id;
        option.textContent = empresa.nome;
        filtroEmpresa.appendChild(option);

    });
}


async function carregarCaminhoes() {
    const {data, error} = await supabase
        .from("caminhoes")
        .select("*");
    if (error) {
        console.error("Erro ao carregar caminhões." + error);
        return;
    }

    let filtroCaminhao = document.getElementById("filtroCaminhao");

    data.forEach(c => {
        let option = document.createElement("option")
        option.value = c.id;
        option.textContent = c.nome;
        filtroCaminhao.appendChild(option);

    });
}

async function listarTotais() {

    const empresa = document.getElementById("filtroEmpresa").value;
    const obra = document.getElementById("filtroObra").value;
    const caminhao = document.getElementById("filtroCaminhao").value;
    const dataIn = document.getElementById("dataIn").value;
    const dataFn = document.getElementById("dataFn").value;

    // Buscar serviços + obra
    let queryServicos = supabase
        .from("servicos")
        .select(`
        *,
        obras!inner (
            id,
            id_empresa,
            preco_fixo,
            valor_km,
            km_distancia,
            valor_total
        )
    `);

    if (obra) queryServicos = queryServicos.eq("id_obra", obra);
    if (empresa) queryServicos = queryServicos.eq("obras.id_empresa", empresa);
    if (caminhao) queryServicos = queryServicos.eq("id_caminhao", caminhao);
    if (dataIn) queryServicos = queryServicos.gte("data", dataIn);
    if (dataFn) queryServicos = queryServicos.lte("data", dataFn);

    const { data: servicos, error: errorServicos } = await queryServicos;

    if (errorServicos) {
        console.error("Erro ao buscar serviços:", errorServicos);
        return;
    }

    // Buscar abastecimentos
    let queryAbast = supabase.from("abastecimento").select("*");
    if (empresa) queryAbast = queryAbast.eq("id_empresa", empresa);
    if (obra) queryAbast = queryAbast.eq("id_empresa", obra);
    if (caminhao) queryAbast = queryAbast.eq("id_caminhao", caminhao);
    if (dataIn) queryAbast = queryAbast.gte("data", dataIn);
    if (dataFn) queryAbast = queryAbast.lte("data", dataFn);

    const { data: abastecimentos, error: errorAbast } = await queryAbast;

    if (errorAbast) {
        console.error("Erro ao buscar abastecimentos:", errorAbast);
        return;
    }

    // ---- Cálculos ----
    let totalCarradas = 0;
    let totalAbastecimentos = 0;
    let valorBruto = 0;

    // Carradas + Valor bruto
    servicos.forEach(item => {
        const quantidade = item.quantidade_carrada || 0;
        totalCarradas += quantidade;

        const obra = item.obras;

            if (obra){
                //const obra = item.obras;
                //const quantidade = item.quantidade_carrada || 0;
                const valorKm = obra?.valor_km || 0;
                const distancia = obra?.km_distancia || 0;
                //const peso = item?.peso || 0;
                const valor_total = obra?.valor_total || 0;

            if (obra.preco_fixo) {
                valorBruto += quantidade * valor_total;
            } else {
                valorBruto += quantidade * valorKm * distancia * (item.peso || 0);
            }
        }
    });

    // Abastecimentos (gastos)
    abastecimentos.forEach(ab => {
        totalAbastecimentos += ab.valor_total || 0;
    });

    // Valor líquido (ganho - gasto)
    const valorLiquido = valorBruto - totalAbastecimentos;

    // ---- Atualiza os cards ----
    document.querySelector("#totalCarrada h3").textContent = totalCarradas;
    document.querySelector("#totalAbastecimento h3").textContent = `R$ ${totalAbastecimentos.toFixed(2)}`;
    document.querySelector("#total h3").textContent = `R$ ${valorLiquido.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", () => {
    carregarObras();
    carregarCaminhoes();
    carregarEmpresas();
    listarTotais();

    const fo = document.getElementById("filtroObra");
    const fc = document.getElementById("filtroCaminhao");
    const fe = document.getElementById("filtroEmpresa");
    const di = document.getElementById("dataIn");
    const df = document.getElementById("dataFn");

    if (fo) fo.addEventListener("change", listarTotais);
    if (fc) fc.addEventListener("change", listarTotais);
    if (di) di.addEventListener("change", listarTotais);
    if (df) df.addEventListener("change", listarTotais);
    if (fe) {
        fe.addEventListener("change", async () => {
            carregarObras(fe.value);
            listarTotais();
        });
    }

    const hamburger = document.getElementById("hamburger");
    const menu = document.getElementById("menu");

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        menu.classList.toggle('active');
    })
});