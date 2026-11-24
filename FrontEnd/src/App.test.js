import { render, screen } from '@testing-library/react';
import App from './App';

test('renderiza o menu com Home e Produtos', () => {
  render(<App />);
  expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Produtos' })).toBeInTheDocument();
});
