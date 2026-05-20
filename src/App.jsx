import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const usuarios = [
  { nome: "Almoxarifado U&C", senha: "UC1", setor: "Almoxarifado (Uso & Consumo)" },
  { nome: "Recebimento e Armazenagem", senha: "RA2", setor: "Operações Recebimento Geral" },
  { nome: "Estoque e Inventário", senha: "EI3", setor: "Estoque" },
  { nome: "Operação Secos", senha: "OS4", setor: "Operações Secos" },
  { nome: "Operações Química", senha: "OQ5", setor: "Operações Químicas" },
  { nome: "Gestão", senha: "GE6", setor: "Todos" },
];

const indicadoresBase = [
  { id: 1, setor: "Operações Químicas", indicador: "Perda MP no Processo", meta: 3, unidade: "%", regraMeta: "menor", tipoCalculo: "r1r2", r1Nome: "Inventário perda em R$ / dia", r2Nome: "Total estoque químico em R$", descricao: "Resultado = R1 / R2 em porcentagem" },
  { id: 2, setor: "Operações Químicas", indicador: "Conformidade Peso na Separação - Erros na 1º Pesagem", meta: 5, unidade: "%", regraMeta: "menor", tipoCalculo: "r1r2", r1Nome: "Qtd de pesagem real em Kg", r2Nome: "Qtd de pesagem solicitada na OP em Kg", descricao: "Resultado = R1 / R2 em porcentagem" },
  { id: 3, setor: "Operações Secos", indicador: "Avarias / Perda Embalagens no Processo", meta: 1, unidade: "%", regraMeta: "menor", tipoCalculo: "r1r2", r1Nome: "Inventário perda em R$ / dia", r2Nome: "Total estoque seco em R$", descricao: "Resultado = R1 / R2 em porcentagem" },
  { id: 4, setor: "Operações Secos", indicador: "Erros de Movimentação DMP", meta: 2, unidade: "%", regraMeta: "menor", tipoCalculo: "r1r2", r1Nome: "Itens movimentados errado", r2Nome: "Total de itens movimentados no turno", descricao: "Resultado = R1 / R2 em porcentagem" },
  { id: 5, setor: "Estoque", indicador: "Acuracidade de Estoque", meta: 98, unidade: "%", regraMeta: "maior", tipoCalculo: "r1r2", r1Nome: "Total de itens corretos", r2Nome: "Total de itens inventariados", descricao: "Resultado = R1 / R2 em porcentagem" },
  { id: 6, setor: "Estoque", indicador: "Ruptura de Produto Acabado causada pelo setor DMP", meta: 2, unidade: "%", regraMeta: "menor", tipoCalculo: "percentualDireto", r1Nome: "Percentual de ruptura do dia", r2Nome: "Não aplicável", descricao: "Resultado = R1 informado em porcentagem" },
  { id: 7, setor: "Operações Recebimento Geral", indicador: "Avarias no Recebimento", meta: 1, unidade: "%", regraMeta: "menor", tipoCalculo: "r1r2", r1Nome: "Recebimento perda em R$ / dia", r2Nome: "Quantidade total recebido no dia em R$", descricao: "Resultado = R1 / R2 em porcentagem" },
  { id: 8, setor: "Operações Recebimento Geral", indicador: "TMR - Tempo Médio de Recebimento", meta: 60, unidade: "min", regraMeta: "menor", tipoCalculo: "mediaTempoMinutos", r1Nome: "Tempo total de recebimento em minutos", r2Nome: "Total de carros/cargas no dia", descricao: "Resultado = tempo total / total de carros ou cargas" },
  { id: 9, setor: "Almoxarifado (Uso & Consumo)", indicador: "Acuracidade de Estoque Almoxarifado U&C", meta: 98, unidade: "%", regraMeta: "maior", tipoCalculo: "r1r2", r1Nome: "Total de itens corretos", r2Nome: "Total de itens inventariados", descricao: "Resultado = R1 / R2 em porcentagem" },
  { id: 10, setor: "Almoxarifado (Uso & Consumo)", indicador: "Ruptura de Produto Acabado causada pelo Almoxarifado U&C", meta: 2, unidade: "%", regraMeta: "menor", tipoCalculo: "percentualDireto", r1Nome: "Percentual de ruptura do dia", r2Nome: "Não aplicável", descricao: "Resultado = R1 informado em porcentagem" },
];

const registrosIniciais = [
  // Base teste — 01/05/2026
  { id: 1, data: "2026-05-01", indicadorId: 1, turno: "Turno 1", r1: 700, r2: 30000 },
  { id: 2, data: "2026-05-01", indicadorId: 1, turno: "Turno 2", r1: 650, r2: 28000 },
  { id: 3, data: "2026-05-01", indicadorId: 2, turno: "Turno 1", r1: 2500, r2: 2480 },
  { id: 4, data: "2026-05-01", indicadorId: 2, turno: "Turno 2", r1: 2600, r2: 2550 },

  // Base teste — 06/05/2026
  { id: 5, data: "2026-05-06", indicadorId: 1, turno: "Turno 1", r1: 900, r2: 34000 },
  { id: 6, data: "2026-05-06", indicadorId: 1, turno: "Turno 2", r1: 780, r2: 32000 },
  { id: 7, data: "2026-05-06", indicadorId: 2, turno: "Turno 1", r1: 3100, r2: 3000 },
  { id: 8, data: "2026-05-06", indicadorId: 2, turno: "Turno 2", r1: 3050, r2: 3000 },

  // Base teste — 13/05/2026
  { id: 9, data: "2026-05-13", indicadorId: 1, turno: "Turno 1", r1: 1250, r2: 48000 },
  { id: 10, data: "2026-05-13", indicadorId: 1, turno: "Turno 2", r1: 980, r2: 47000 },
  { id: 11, data: "2026-05-13", indicadorId: 2, turno: "Turno 1", r1: 5020, r2: 5000 },
  { id: 12, data: "2026-05-13", indicadorId: 2, turno: "Turno 2", r1: 2990, r2: 3000 },

  // Base teste — Operações Secos
  { id: 13, data: "2026-05-01", indicadorId: 3, turno: "Turno 1", r1: 240, r2: 30000 },
  { id: 14, data: "2026-05-01", indicadorId: 3, turno: "Turno 2", r1: 260, r2: 32000 },
  { id: 15, data: "2026-05-06", indicadorId: 3, turno: "Turno 1", r1: 340, r2: 62000 },
  { id: 16, data: "2026-05-06", indicadorId: 3, turno: "Turno 2", r1: 410, r2: 61500 },
  { id: 17, data: "2026-05-13", indicadorId: 4, turno: "Turno 1", r1: 2, r2: 160 },
  { id: 18, data: "2026-05-13", indicadorId: 4, turno: "Turno 2", r1: 4, r2: 170 },

  // Base teste — Estoque
  { id: 19, data: "2026-05-01", indicadorId: 5, turno: "Turno 1", r1: 98, r2: 100 },
  { id: 20, data: "2026-05-01", indicadorId: 5, turno: "Turno 2", r1: 99, r2: 100 },
  { id: 21, data: "2026-05-06", indicadorId: 5, turno: "Turno 1", r1: 156, r2: 158 },
  { id: 22, data: "2026-05-06", indicadorId: 5, turno: "Turno 2", r1: 147, r2: 150 },
  { id: 23, data: "2026-05-13", indicadorId: 6, turno: "Turno 1", r1: 1.4, r2: 0 },
  { id: 24, data: "2026-05-13", indicadorId: 6, turno: "Turno 2", r1: 1.8, r2: 0 },

  // Base teste — Recebimento Geral
  { id: 25, data: "2026-05-01", indicadorId: 7, turno: "Turno 1", r1: 120, r2: 25000 },
  { id: 26, data: "2026-05-01", indicadorId: 7, turno: "Turno 2", r1: 180, r2: 30000 },
  { id: 27, data: "2026-05-06", indicadorId: 8, turno: "Turno 1", r1: 240, r2: 4 },
  { id: 28, data: "2026-05-06", indicadorId: 8, turno: "Turno 2", r1: 300, r2: 5 },
  { id: 29, data: "2026-05-13", indicadorId: 7, turno: "Turno 1", r1: 180, r2: 42000 },
  { id: 30, data: "2026-05-13", indicadorId: 7, turno: "Turno 2", r1: 260, r2: 51500 },

  // Base teste — Almoxarifado U&C
  { id: 31, data: "2026-05-01", indicadorId: 9, turno: "Turno 1", r1: 97, r2: 99 },
  { id: 32, data: "2026-05-01", indicadorId: 9, turno: "Turno 2", r1: 111, r2: 112 },
  { id: 33, data: "2026-05-06", indicadorId: 10, turno: "Turno 1", r1: 1.2, r2: 0 },
  { id: 34, data: "2026-05-06", indicadorId: 10, turno: "Turno 2", r1: 1.6, r2: 0 },
  { id: 35, data: "2026-05-13", indicadorId: 9, turno: "Turno 1", r1: 120, r2: 122 },
  { id: 36, data: "2026-05-13", indicadorId: 9, turno: "Turno 2", r1: 118, r2: 120 },
];

function calcularResultado(registros, indicador) {
  if (indicador.tipoCalculo === "percentualDireto") {
    if (!registros.length) return 0;
    return registros.reduce((acc, item) => acc + Number(item.r1 || 0), 0) / registros.length;
  }
  if (indicador.tipoCalculo === "mediaTempoMinutos") {
    const somaMinutos = registros.reduce((acc, item) => acc + Number(item.r1 || 0), 0);
    const somaCargas = registros.reduce((acc, item) => acc + Number(item.r2 || 0), 0);
    return somaCargas ? somaMinutos / somaCargas : 0;
  }
  const somaR1 = registros.reduce((acc, item) => acc + Number(item.r1 || 0), 0);
  const somaR2 = registros.reduce((acc, item) => acc + Number(item.r2 || 0), 0);
  return somaR2 ? (somaR1 / somaR2) * 100 : 0;
}

function formatarTempoHHMM(minutos) {
  const totalMinutos = Math.round(Number(minutos || 0));
  const horas = Math.floor(totalMinutos / 60);
  const mins = totalMinutos % 60;
  return `${String(horas).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

function statusIndicador(resultado, indicador) {
  const dentroDaMeta = indicador.regraMeta === "menor" ? resultado <= indicador.meta : resultado >= indicador.meta;
  if (dentroDaMeta) return { texto: "Dentro da Meta", classe: "bg-green-100 text-green-800 border-green-300", painel: "bg-green-600 text-white", borda: "border-green-400" };
  return { texto: "Fora da Meta", classe: "bg-red-100 text-red-800 border-red-300", painel: "bg-red-600 text-white", borda: "border-red-400" };
}

function Card({ children, className = "" }) {
  return <div className={`rounded-3xl bg-white p-5 shadow-sm border ${className || "border-slate-100"}`}>{children}</div>;
}

function Badge({ children, className = "" }) {
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${className}`}>{children}</span>;
}

function valorFormatado(valor, indicador) {
  return indicador.tipoCalculo === "mediaTempoMinutos" ? formatarTempoHHMM(valor) : `${Number(valor || 0).toFixed(2)}${indicador.unidade}`;
}

function formatarDataISO(data) {
  return data.toISOString().slice(0, 10);
}

function obterInicioSemana(dataBase) {
  const data = new Date(`${dataBase}T00:00:00`);
  const diaSemana = data.getDay();
  const diferenca = diaSemana === 0 ? -6 : 1 - diaSemana;
  data.setDate(data.getDate() + diferenca);
  return data;
}

function obterFimSemana(dataBase) {
  const inicio = obterInicioSemana(dataBase);
  const fim = new Date(inicio);
  fim.setDate(inicio.getDate() + 6);
  return fim;
}

function registroDentroPeriodo(registro, inicio, fim) {
  return registro.data >= inicio && registro.data <= fim;
}

export default function AppIndicadoresArea() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [login, setLogin] = useState({ nome: "", senha: "" });
  const [erroLogin, setErroLogin] = useState("");
  const [aba, setAba] = useState("dashboard");
  const [dataFiltro, setDataFiltro] = useState("2026-05-13");
  const [anoFiltro, setAnoFiltro] = useState(2026);
  const [mesFiltro, setMesFiltro] = useState(5);
  const [tipoVisao, setTipoVisao] = useState("diario");
  const [semanaFiltro, setSemanaFiltro] = useState("2");
  const [diaCalendarioFiltro, setDiaCalendarioFiltro] = useState("2026-05-13");
  const [setorFiltro, setSetorFiltro] = useState("Todos");
  const [registros, setRegistros] = useState(registrosIniciais);
  const [novo, setNovo] = useState({ data: "2026-05-13", indicadorId: 1, turno: "Turno 1", r1: "", r2: "", anexos: [] });

  const setoresDisponiveis = useMemo(() => ["Todos", ...Array.from(new Set(indicadoresBase.map((i) => i.setor)))], []);

  const periodoSelecionado = useMemo(() => {
    const nomesMeses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    if (tipoVisao === "diario") {
      const dataSelecionada = new Date(`${diaCalendarioFiltro}T00:00:00`);
      const diaFormatado = dataSelecionada.toLocaleDateString("pt-BR");
      return {
        inicio: diaCalendarioFiltro,
        fim: diaCalendarioFiltro,
        label: `Visão diária — ${diaFormatado}`,
      };
    }

    const inicioMes = new Date(anoFiltro, mesFiltro - 1, 1);
    const fimMes = new Date(anoFiltro, mesFiltro, 0);

    if (tipoVisao === "mensal") {
      return {
        inicio: formatarDataISO(inicioMes),
        fim: formatarDataISO(fimMes),
        label: `Visão mensal — ${nomesMeses[mesFiltro - 1]} de ${anoFiltro}`,
      };
    }

    const numeroSemana = Number(semanaFiltro);
    const diaInicio = 1 + (numeroSemana - 1) * 7;
    const diaFim = Math.min(diaInicio + 6, fimMes.getDate());
    const inicioSemana = new Date(anoFiltro, mesFiltro - 1, diaInicio);
    const fimSemana = new Date(anoFiltro, mesFiltro - 1, diaFim);

    return {
      inicio: formatarDataISO(inicioSemana),
      fim: formatarDataISO(fimSemana),
      label: `Visão semanal — ${numeroSemana}ª semana de ${nomesMeses[mesFiltro - 1]} de ${anoFiltro}`,
    };
  }, [tipoVisao, anoFiltro, mesFiltro, semanaFiltro, diaCalendarioFiltro]);

  const resumoIndicadores = useMemo(() => {
    return indicadoresBase
      .filter((indicador) => setorFiltro === "Todos" || indicador.setor === setorFiltro)
      .map((indicador) => {
        const regs = registros.filter((r) => r.indicadorId === indicador.id && registroDentroPeriodo(r, periodoSelecionado.inicio, periodoSelecionado.fim));
        const resultado = calcularResultado(regs, indicador);
        const somaR1 = regs.reduce((acc, item) => acc + Number(item.r1 || 0), 0);
        const somaR2 = regs.reduce((acc, item) => acc + Number(item.r2 || 0), 0);
        return { ...indicador, resultado, status: statusIndicador(resultado, indicador), registros: regs, somaR1, somaR2 };
      });
  }, [registros, periodoSelecionado, setorFiltro]);

  const verdes = resumoIndicadores.filter((i) => i.status.texto === "Dentro da Meta").length;
  const vermelhos = resumoIndicadores.filter((i) => i.status.texto === "Fora da Meta").length;

  function gerarCurvaIndicador(indicador) {
    const base = new Date(`${diaCalendarioFiltro}T00:00:00`);
    const dias = [];
    for (let i = 4; i >= 0; i--) {
      const data = new Date(base);
      data.setDate(base.getDate() - i);
      const dataISO = data.toISOString().slice(0, 10);
      const diaMes = data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      const regsDia = registros.filter((r) => r.indicadorId === indicador.id && r.data === dataISO);
      dias.push({ data: diaMes, resultado: Number(calcularResultado(regsDia, indicador).toFixed(2)), meta: indicador.meta });
    }
    return dias;
  }

  function entrar() {
    const usuario = usuarios.find((u) => u.nome === login.nome && u.senha === login.senha);
    if (!usuario) {
      setErroLogin("Usuário ou senha inválidos.");
      return;
    }
    setUsuarioLogado(usuario);
    setSetorFiltro(usuario.setor);
    const primeiroIndicador = indicadoresBase.find((i) => usuario.setor === "Todos" || i.setor === usuario.setor);
    if (primeiroIndicador) setNovo((atual) => ({ ...atual, indicadorId: primeiroIndicador.id }));
    setErroLogin("");
  }

  function sair() {
    setUsuarioLogado(null);
    setLogin({ nome: "", senha: "" });
    setSetorFiltro("Todos");
  }

  function adicionarRegistro() {
    const indicadorSelecionado = indicadoresBase.find((i) => i.id === Number(novo.indicadorId));
    if (!indicadorSelecionado || !novo.data || !novo.r1) return;
    if (indicadorSelecionado.tipoCalculo !== "percentualDireto" && !novo.r2) return;
    setRegistros([...registros, {
      id: Date.now(),
      data: novo.data,
      indicadorId: Number(novo.indicadorId),
      turno: novo.turno,
      r1: Number(novo.r1),
      r2: indicadorSelecionado.tipoCalculo === "percentualDireto" ? 0 : Number(novo.r2),
      anexos: novo.anexos,
    }]);
    setDataFiltro(novo.data);
    setNovo({ ...novo, r1: "", r2: "", anexos: [] });
  }

  function removerRegistro(id) {
    setRegistros(registros.filter((r) => r.id !== id));
  }

  if (!usuarioLogado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 p-6 text-slate-900">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Gestão Integrada</p>
          <h1 className="mt-2 text-3xl font-bold">Login do Líder</h1>
          <p className="mt-2 text-sm text-slate-500">Acesse os indicadores do seu setor.</p>
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-600">Usuário</label>
              <select value={login.nome} onChange={(e) => setLogin({ ...login, nome: e.target.value })} className="mt-1 w-full rounded-xl border px-4 py-3">
                <option value="">Selecione o usuário</option>
                {usuarios.map((u) => <option key={u.nome} value={u.nome}>{u.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">Senha</label>
              <input type="password" value={login.senha} onChange={(e) => setLogin({ ...login, senha: e.target.value })} placeholder="Digite a senha" className="mt-1 w-full rounded-xl border px-4 py-3" />
            </div>
            {erroLogin && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{erroLogin}</p>}
            <button onClick={entrar} className="w-full rounded-xl bg-slate-900 px-5 py-3 font-bold text-white">Entrar</button>
          </div>
          <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">
            <p className="font-bold">Usuários habilitados:</p>
            <p>Almoxarifado U&C</p>
            <p>Recebimento e Armazenagem</p>
            <p>Estoque e Inventário</p>
            <p>Operação Secos</p>
            <p>Operações Química</p>
            <p>Gestão</p>
          </div>
        </div>
      </div>
    );
  }

  const indicadoresParaEntrada = indicadoresBase.filter((ind) => usuarioLogado.setor === "Todos" || ind.setor === usuarioLogado.setor);
  const indicadorEntrada = indicadoresBase.find((i) => i.id === Number(novo.indicadorId)) || indicadoresParaEntrada[0];

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-300">Gestão Integrada de Operações & Materiais</p>
              <h1 className="mt-2 text-3xl font-bold">Aplicativo de Indicadores Operacionais</h1>
              <p className="mt-2 text-slate-300">Controle diário por setor, data, dois turnos, cálculo automático e semáforo executivo.</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 text-sm">
              <p className="text-slate-300">Usuário logado</p>
              <p className="font-bold">{usuarioLogado.nome}</p>
              <p className="text-slate-300">Setor: {usuarioLogado.setor}</p>
              <button onClick={sair} className="mt-3 rounded-xl bg-white px-4 py-2 font-bold text-slate-900">Sair</button>
            </div>
          </div>
        </header>

        <nav className="grid grid-cols-3 gap-2 rounded-2xl bg-white p-2 shadow-sm">
          {[["dashboard", "Dashboard Executivo"], ["entrada", "Entrada Manual"], ["tv", "Modo TV"]].map(([valor, texto]) => (
            <button key={valor} onClick={() => setAba(valor)} className={`rounded-xl px-4 py-3 font-semibold ${aba === valor ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}>{texto}</button>
          ))}
        </nav>

        {aba === "dashboard" && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium">Setor:</span>
              <select value={setorFiltro} onChange={(e) => setSetorFiltro(e.target.value)} disabled={usuarioLogado.setor !== "Todos"} className="rounded-xl border bg-white px-4 py-2 disabled:bg-slate-100 disabled:text-slate-500">
                {setoresDisponiveis.map((s) => <option key={s}>{s}</option>)}
              </select>
              <span className="text-sm font-medium">Visão:</span>
              <select value={tipoVisao} onChange={(e) => setTipoVisao(e.target.value)} className="rounded-xl border bg-white px-4 py-2">
                <option value="diario">Diária</option>
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
              </select>

              {tipoVisao === "diario" && (
                <div className="flex items-center gap-2 rounded-2xl border bg-white px-4 py-2 shadow-sm">
                  <span className="text-sm font-medium text-slate-600">Dia:</span>
                  <input
                    type="date"
                    value={diaCalendarioFiltro}
                    onChange={(e) => {
                      setDiaCalendarioFiltro(e.target.value);
                      setDataFiltro(e.target.value);
                      const data = new Date(`${e.target.value}T00:00:00`);
                      setAnoFiltro(data.getFullYear());
                      setMesFiltro(data.getMonth() + 1);
                    }}
                    className="rounded-xl border bg-slate-50 px-3 py-2"
                  />
                </div>
              )}

              {(tipoVisao === "semanal" || tipoVisao === "mensal") && (
                <>
                  <span className="text-sm font-medium">Ano:</span>
                  <select value={anoFiltro} onChange={(e) => setAnoFiltro(Number(e.target.value))} className="rounded-xl border bg-white px-4 py-2">
                    <option value={2026}>2026</option>
                    <option value={2027}>2027</option>
                    <option value={2028}>2028</option>
                  </select>

                  <span className="text-sm font-medium">Mês:</span>
                  <select value={mesFiltro} onChange={(e) => setMesFiltro(Number(e.target.value))} className="rounded-xl border bg-white px-4 py-2">
                    <option value={1}>Janeiro</option>
                    <option value={2}>Fevereiro</option>
                    <option value={3}>Março</option>
                    <option value={4}>Abril</option>
                    <option value={5}>Maio</option>
                    <option value={6}>Junho</option>
                    <option value={7}>Julho</option>
                    <option value={8}>Agosto</option>
                    <option value={9}>Setembro</option>
                    <option value={10}>Outubro</option>
                    <option value={11}>Novembro</option>
                    <option value={12}>Dezembro</option>
                  </select>
                </>
              )}

              {tipoVisao === "semanal" && (
                <>
                  <span className="text-sm font-medium">Semana:</span>
                  <select value={semanaFiltro} onChange={(e) => setSemanaFiltro(e.target.value)} className="rounded-xl border bg-white px-4 py-2">
                    <option value="1">1ª semana</option>
                    <option value="2">2ª semana</option>
                    <option value="3">3ª semana</option>
                    <option value="4">4ª semana</option>
                    <option value="5">5ª semana</option>
                  </select>
                </>
              )}

              <Badge className="bg-slate-100 text-slate-700 border-slate-300">{periodoSelecionado.label}</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-5">
              <Card><p className="text-sm text-slate-500">Setor</p><h2 className="text-xl font-bold">{setorFiltro}</h2></Card>
              <Card><p className="text-sm text-slate-500">Indicadores</p><h2 className="text-3xl font-bold">{resumoIndicadores.length}</h2></Card>
              <Card><p className="text-sm text-slate-500">Dentro da Meta</p><h2 className="text-3xl font-bold text-green-700">{verdes}</h2></Card>
              <Card><p className="text-sm text-slate-500">Fora da Meta</p><h2 className="text-3xl font-bold text-red-700">{vermelhos}</h2></Card>
              <Card><p className="text-sm text-slate-500">Registros do Período</p><h2 className="text-3xl font-bold">{resumoIndicadores.reduce((acc, i) => acc + i.registros.length, 0)}</h2></Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {resumoIndicadores.map((item) => (
                <Card key={item.id} className={item.status.borda}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500">{item.setor}</p>
                      <h3 className="text-xl font-bold">{item.indicador}</h3>
                      <p className="mt-1 text-sm text-slate-500">Meta: {item.regraMeta === "menor" ? "até" : "mínimo"} {item.meta}{item.unidade} | {item.descricao}</p>
                    </div>
                    <Badge className={item.status.classe}>{item.status.texto}</Badge>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-slate-100 p-4"><p className="text-xs text-slate-500">R1 Total</p><h4 className="text-xl font-bold">{item.somaR1.toLocaleString("pt-BR")}</h4></div>
                    <div className="rounded-2xl bg-slate-100 p-4"><p className="text-xs text-slate-500">R2 Total</p><h4 className="text-xl font-bold">{item.tipoCalculo === "percentualDireto" ? "N/A" : item.somaR2.toLocaleString("pt-BR")}</h4></div>
                    <div className={`rounded-2xl p-4 ${item.status.painel}`}><p className="text-xs opacity-80">Resultado</p><h4 className="text-2xl font-bold">{valorFormatado(item.resultado, item)}</h4></div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold">Curva de Resultado - Últimos 5 Dias</h3>
                <p className="text-sm text-slate-500">Visualização individual por setor e indicador, considerando o período consolidado selecionado.</p>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                {resumoIndicadores.map((indicador) => {
                  const dadosCurva = gerarCurvaIndicador(indicador);
                  return (
                    <Card key={indicador.id} className={indicador.status.borda}>
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm text-slate-500">{indicador.setor}</p>
                          <h4 className="text-lg font-bold">{indicador.indicador}</h4>
                          <p className="text-sm text-slate-500">Meta: {indicador.regraMeta === "menor" ? "até" : "mínimo"} {indicador.meta}{indicador.unidade}</p>
                        </div>
                        <Badge className={indicador.status.classe}>{indicador.status.texto}</Badge>
                      </div>
                      <div className={`mb-3 rounded-2xl p-4 text-center font-bold ${indicador.status.painel}`}>Resultado atual: {valorFormatado(indicador.resultado, indicador)}</div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={dadosCurva}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="data" />
                            <YAxis />
                            <Tooltip formatter={(value, name) => indicador.tipoCalculo === "mediaTempoMinutos" ? [formatarTempoHHMM(value), name] : [`${Number(value).toFixed(2)}${indicador.unidade}`, name]} />
                            <Line type="monotone" dataKey="meta" name="Meta" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                            <Line type="monotone" dataKey="resultado" name="Resultado" strokeWidth={3} dot={{ r: 4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {aba === "entrada" && (
          <section className="space-y-6">
            <Card>
              <h3 className="mb-4 text-xl font-bold">Preenchimento diário por turno</h3>
              <div className="grid gap-3 md:grid-cols-5">
                <input type="date" value={novo.data} onChange={(e) => setNovo({ ...novo, data: e.target.value })} className="rounded-xl border px-3 py-2" />
                <select value={novo.indicadorId} onChange={(e) => setNovo({ ...novo, indicadorId: Number(e.target.value), r1: "", r2: "" })} className="rounded-xl border px-3 py-2 md:col-span-2">
                  {indicadoresParaEntrada.map((ind) => <option key={ind.id} value={ind.id}>{ind.setor} | {ind.indicador}</option>)}
                </select>
                <select value={novo.turno} onChange={(e) => setNovo({ ...novo, turno: e.target.value })} className="rounded-xl border px-3 py-2">
                  <option>Turno 1</option>
                  <option>Turno 2</option>
                </select>
                <button onClick={adicionarRegistro} className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white">Adicionar</button>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input placeholder={indicadorEntrada?.r1Nome || "R1"} type="number" value={novo.r1} onChange={(e) => setNovo({ ...novo, r1: e.target.value })} className="rounded-xl border px-3 py-2" />
                {indicadorEntrada?.tipoCalculo !== "percentualDireto" && <input placeholder={indicadorEntrada?.r2Nome || "R2"} type="number" value={novo.r2} onChange={(e) => setNovo({ ...novo, r2: e.target.value })} className="rounded-xl border px-3 py-2" />}
              </div>
              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <label className="text-sm font-bold text-slate-700">Anexar fotos ou documentos</label>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv"
                  onChange={(e) => {
                    const arquivos = Array.from(e.target.files || []).map((file) => ({
                      nome: file.name,
                      tipo: file.type || "documento",
                      tamanho: file.size,
                      url: URL.createObjectURL(file),
                    }));
                    setNovo({ ...novo, anexos: arquivos });
                  }}
                  className="mt-2 block w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
                {novo.anexos.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {novo.anexos.map((arquivo, index) => (
                      <div key={index} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm shadow-sm">
                        <span className="font-medium text-slate-700">{arquivo.nome}</span>
                        <a href={arquivo.url} target="_blank" rel="noreferrer" className="font-bold text-blue-700">Visualizar</a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="mt-3 text-sm text-slate-500">Para TMR, informe o tempo total em minutos no R1 e o total de carros/cargas no R2. O resultado será exibido em HH:MM.</p>
            </Card>

            <Card>
              <h3 className="mb-4 text-xl font-bold">Registros lançados</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 text-left"><tr><th className="p-3">Data</th><th>Indicador</th><th>Turno</th><th>R1</th><th>R2</th><th>Resultado</th><th>Anexos</th><th></th></tr></thead>
                  <tbody>
                    {registros.filter((r) => {
                      const ind = indicadoresBase.find((i) => i.id === r.indicadorId);
                      return usuarioLogado.setor === "Todos" || ind?.setor === usuarioLogado.setor;
                    }).map((r) => {
                      const indicador = indicadoresBase.find((i) => i.id === r.indicadorId);
                      const resultado = indicador ? calcularResultado([r], indicador) : 0;
                      const st = indicador ? statusIndicador(resultado, indicador) : { painel: "bg-slate-500 text-white" };
                      return (
                        <tr key={r.id} className="border-t">
                          <td className="p-3 font-medium">{r.data}</td>
                          <td>{indicador?.indicador}</td>
                          <td>{r.turno}</td>
                          <td>{Number(r.r1).toLocaleString("pt-BR")}</td>
                          <td>{indicador?.tipoCalculo === "percentualDireto" ? "N/A" : Number(r.r2).toLocaleString("pt-BR")}</td>
                          <td><span className={`rounded-full px-3 py-1 font-bold ${st.painel}`}>{indicador ? valorFormatado(resultado, indicador) : "-"}</span></td>
                          <td>
                            {r.anexos?.length ? (
                              <div className="space-y-1">
                                {r.anexos.map((arquivo, index) => (
                                  <a key={index} href={arquivo.url} target="_blank" rel="noreferrer" className="block font-bold text-blue-700">{arquivo.nome}</a>
                                ))}
                              </div>
                            ) : <span className="text-slate-400">Sem anexo</span>}
                          </td>
                          <td><button onClick={() => removerRegistro(r.id)} className="rounded-lg bg-red-50 px-3 py-1 text-xs font-bold text-red-700">Excluir</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        )}

        {aba === "tv" && (
          <section className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
            <p className="text-slate-400">Modo TV Operacional | {periodoSelecionado.label}</p>
            <h2 className="text-4xl font-bold">Performance - {setorFiltro}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl bg-white/10 p-6"><p className="text-slate-300">Indicadores</p><h3 className="mt-2 text-5xl font-bold">{resumoIndicadores.length}</h3></div>
              <div className="rounded-3xl bg-white/10 p-6"><p className="text-slate-300">Dentro da Meta</p><h3 className="mt-2 text-5xl font-bold">{verdes}</h3></div>
              <div className="rounded-3xl bg-white/10 p-6"><p className="text-slate-300">Fora da Meta</p><h3 className="mt-2 text-5xl font-bold">{vermelhos}</h3></div>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {resumoIndicadores.map((i) => <div key={i.id} className={`rounded-2xl p-6 ${i.status.painel}`}><p className="text-sm opacity-80">Meta: {i.regraMeta === "menor" ? "até" : "mínimo"} {i.meta}{i.unidade}</p><h4 className="text-2xl font-bold">{i.indicador}</h4><p className="mt-3 text-5xl font-bold">{valorFormatado(i.resultado, i)}</p><Badge className="mt-4 border-white bg-white/20 text-white">{i.status.texto}</Badge></div>)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
