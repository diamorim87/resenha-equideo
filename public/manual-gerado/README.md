# Ilustrações da cartilha

As 16 pranchas desta pasta foram criadas com a ferramenta integrada de geração de imagens e convertidas para JPEG de qualidade 84 para reduzir o download. Mostram animais fictícios e têm finalidade didática; não são fotografias de exemplares registrados nem substituem a observação do animal ou a avaliação de um profissional.

## Direção usada nos prompts

- **Pelagens:** ficha científica com um animal adulto por quadro, em perfil lateral completo voltado à esquerda, mesmo enquadramento e escala, fundo marfim, luz natural difusa, textura realista dos pelos. Sem sela, cabresto, pessoas, cenários, rótulos ou texto. Cada quadro descreveu a cor do corpo, da crina, da cauda, das extremidades e o padrão particular da opção correspondente em `src/data/pelagens.ts`.
- **Particularidades da cabeça:** o mesmo cavalo fictício alazão visto de frente, da testa ao focinho, com uma única marca branca no local indicado pelo nome e descrição em `src/components/GuideModal.tsx`. O arquivo `bebe-em-branco.jpg` foi gerado separadamente para restringir a marca ao lábio.
- **Particularidades do corpo:** cavalo fictício baio em perfil completo, com uma única faixa, listra, cicatriz, depressão ou mancha localizada conforme a descrição da cartilha. Os diagramas vetoriais ao lado continuam sendo a referência para o traçado na ficha.

As pranchas compostas têm cinco figuras em grade de três colunas e duas linhas; a última célula fica vazia. A ordem de leitura é da esquerda para a direita e de cima para baixo. `ManualIllustration.tsx` usa essa ordem para mostrar cada figura no cartão correto.
