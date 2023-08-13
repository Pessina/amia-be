function convertToHTMLTable(input) {
  const sections = input.split('\n\n');
  let resultHTML = '';

  for (let i = 0; i < sections.length; i += 2) {
    if (i + 1 >= sections.length) {
      console.warn(`Skipping a section due to insufficient lines. Section: ${sections[i]}`);
      continue;
    }

    const tableName = sections[i];
    const lines = sections[i + 1].split('\n');

    const headers = lines[0]
      .split('|')
      .map((header) => header.trim())
      .filter((header) => header); // remove empty headers

    const rows = lines.slice(1).map(
      (row) =>
        row
          .split('|')
          .map((cell) => cell.trim())
          .filter((cell) => cell) // remove empty cells
    );

    resultHTML += `<h2>${tableName.replace('-', '').trim()}</h2>`;
    resultHTML += '<table border="1"><thead><tr>';

    headers.forEach((header) => {
      resultHTML += `<th>${header}</th>`;
    });

    resultHTML += '</tr></thead><tbody>';

    rows.forEach((row) => {
      // Skip the separator rows
      if (row.join('').indexOf('----') === -1) {
        resultHTML += '<tr>';
        row.forEach((cell) => {
          resultHTML += `<td>${cell}</td>`;
        });
        resultHTML += '</tr>';
      }
    });

    resultHTML += '</tbody></table>';
  }

  return resultHTML;
}

const inputString =
  '- Todos os sintomas e Queixas:\n\n| Sintoma/Queixa | Início | Piora | Localização | Periodicidade | Ritmo | Qualidade | Intensidade | Fatores Agravantes e de Alívio | Sintomas Concomitantes | Eventos Pregressos Semelhantes |\n|----------------|--------|-------|-------------|---------------|-------|-----------|-------------|--------------------------------|------------------------|-------------------------------|\n| Tosse          | Vida toda | Última semana | Pulmões | Constante | Mais intensa ao acordar | Seca, com secreção amarela e traços de sangue | Alta | - | Falta de ar ao subir escadas | Sim, mas sem sangue |\n| Falta de ar    | Última semana | - | Pulmões | Ao subir escadas | - | - | - | Subir escadas | Tosse | - |\n| Dor na coluna  | - | - | Coluna | - | - | - | - | - | - | - |\n| Dor no abdômen | - | - | Abdômen | - | - | - | - | - | - | - |\n\n- Remédios:\n\n| Remédio | Dose | Frequência |\n|---------|------|------------|\n| Plopidogrel | 5mg | Uma vez ao dia |\n| Aspirina | 100mg | Uma vez ao dia |\n| Rosuvastatina | 200mg | Uma vez ao dia |\n| Enalapril | 300mg | Uma vez ao dia |\n| Hidroclorotiazida | 150mg | Uma vez ao dia |\n| Glifage | 150mg | Três vezes ao dia |\n| Metformina | 200mg | Duas vezes ao dia |\n\n- Exames:\n\n| Exame | Tempo Decorrido |\n|-------|-----------------|\n| Raio-X | - |\n| Tomografia | - |\n\n- Cirurgias:\n\n| Cirurgia | Tempo Decorrido | Motivo |\n|----------|-----------------|--------|\n| Cateterismo | 5 anos atrás | Infarto |\n\n- Alergias:\n\n| Alergia | Reação |\n|---------|--------|\n| - | - |\n\n- Doenças do Paciente (presente e passado):\n\n| Doença | Tempo Decorrido Diagnóstico | Tratamento |\n|--------|-----------------------------|------------|\n| Infarto | 5 anos atrás | Cateterismo |\n| Pressão alta | - | Medicamentos |\n| Diabetes | 10 anos atrás | Medicamentos |\n\n- Doenças Família:\n\n| Doença | Parentesco |\n|--------|------------|\n| Câncer de pulmão | Pai |\n| Pressão alta | Mãe |\n| Diabetes | Mãe |\n\n- Maus Hábitos:\n\n| Hábito | Início | Término | Frequência |\n|--------|--------|---------|------------|\n| Fumar | Há 40 anos | - | Um maço por dia |\n| Beber | - | - | Finais de semana |\n\n- Bons Hábitos:\n\n| Hábito | Início | Término | Frequência |\n|--------|--------|---------|------------|\n| - | - | - | - |\n\n- Alimentação:\n\n| Alimentação |\n|-------------|\n| Normal |\n\n- Atividade Física:\n\n| Atividade | Frequência |\n|-----------|------------|\n| Caminhada | - |';
const htmlOutput = convertToHTMLTable(inputString);
console.log(htmlOutput);
