import mockProducts from '../mocks/mockProducts';
import recommendationService, {
  filterProductsByPreferences,
  calculateProductScore,
  sortProductsByScore,
  getSingleProduct,
} from './recommendation.service';

describe('recommendationService - getRecommendations', () => {
  test('Retorna recomendação correta para SingleProduct com base nas preferências selecionadas', () => {
    const formData = {
      selectedPreferences: ['Integração com chatbots'],
      selectedFeatures: ['Chat ao vivo e mensagens automatizadas'],
      selectedRecommendationType: 'SingleProduct',
    };

    const recommendations = recommendationService.getRecommendations(formData, mockProducts);

    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].name).toBe('RD Conversas');
  });

  test('Retorna recomendações corretas para MultipleProducts com base nas preferências selecionadas', () => {
    const formData = {
      selectedPreferences: [
        'Integração fácil com ferramentas de e-mail',
        'Personalização de funis de vendas',
        'Automação de marketing',
      ],
      selectedFeatures: [
        'Rastreamento de interações com clientes',
        'Rastreamento de comportamento do usuário',
      ],
      selectedRecommendationType: 'MultipleProducts',
    };

    const recommendations = recommendationService.getRecommendations(formData, mockProducts);

    expect(recommendations).toHaveLength(2);
    expect(recommendations.map((product) => product.name)).toEqual([
      'RD Station CRM',
      'RD Station Marketing',
    ]);
  });

  test('Retorna apenas um produto para SingleProduct com mais de um produto de match', () => {
    const formData = {
      selectedPreferences: [
        'Integração fácil com ferramentas de e-mail',
        'Automação de marketing',
      ],
      selectedFeatures: [
        'Rastreamento de interações com clientes',
        'Rastreamento de comportamento do usuário',
      ],
      selectedRecommendationType: 'SingleProduct',
    };

    const recommendations = recommendationService.getRecommendations(formData, mockProducts);

    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].name).toBe('RD Station Marketing');
  });

  test('Retorna o último match em caso de empate para SingleProduct', () => {
    const formData = {
      selectedPreferences: ['Automação de marketing', 'Integração com chatbots'],
      selectedRecommendationType: 'SingleProduct',
    };

    const recommendations = recommendationService.getRecommendations(formData, mockProducts);

    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].name).toBe('RD Conversas');
  });
});

describe('recommendationService - funções auxiliares', () => {
  test('filterProductsByPreferences filtra produtos corretamente', () => {
    const selectedPreferences = ['Automação de marketing'];
    const filtered = filterProductsByPreferences(mockProducts, selectedPreferences);
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('RD Station Marketing');
  });

  test('calculateProductScore calcula pontuação corretamente', () => {
    const product = mockProducts[1]; 
    const formData = {
      selectedPreferences: ['Automação de marketing'],
      selectedFeatures: ['Criação e gestão de campanhas de e-mail'],
    };
    const score = calculateProductScore(product, formData);
    expect(score).toBe(2);
  });

  test('sortProductsByScore ordena produtos do maior para menor score', () => {
    const productsWithScore = [
      { name: 'Produto A', score: 1 },
      { name: 'Produto B', score: 3 },
      { name: 'Produto C', score: 2 },
    ];
    const sorted = sortProductsByScore(productsWithScore);
    expect(sorted.map(p => p.name)).toEqual(['Produto B', 'Produto C', 'Produto A']);
  });

  test('getSingleProduct retorna o último produto em caso de empate', () => {
    const sorted = [
      { name: 'Produto A', score: 2 },
      { name: 'Produto B', score: 2 },
    ];
    const single = getSingleProduct(sorted);
    expect(single.name).toBe('Produto B');
  });

  test('getSingleProduct retorna null se array vazio', () => {
    expect(getSingleProduct([])).toBeNull();
  });
});