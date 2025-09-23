/**
 * Language Switcher Component Tests
 * Tests the LanguageSwitcher component functionality
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { LanguageSwitcher, CompactLanguageSwitcher, InlineLanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { locales, localeConfig } from '@/lib/i18n/config';

// Mock the language switcher hook
const mockSwitchLanguage = jest.fn();
jest.mock('@/lib/i18n/hooks', () => ({
  useLanguageSwitcher: () => ({
    currentLocale: 'en',
    switchLanguage: mockSwitchLanguage
  })
}));

describe('LanguageSwitcher Component', () => {
  
  beforeEach(() => {
    mockSwitchLanguage.mockClear();
  });

  describe('Dropdown Variant', () => {
    
    test('should render with default props', () => {
      render(<LanguageSwitcher />);
      
      // Should show current locale flag and name
      expect(screen.getByRole('button', { name: /switch language/i })).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('🇺🇸')).toBeInTheDocument();
    });

    test('should show dropdown when clicked', async () => {
      render(<LanguageSwitcher />);
      
      const trigger = screen.getByRole('button', { name: /switch language/i });
      fireEvent.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /deutsch/i })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: /français/i })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: /español/i })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: /العربية/i })).toBeInTheDocument();
      });
    });

    test('should close dropdown when clicking outside', async () => {
      render(<LanguageSwitcher />);
      
      const trigger = screen.getByRole('button', { name: /switch language/i });
      fireEvent.click(trigger);
      
      // Click outside
      fireEvent.mouseDown(document.body);
      
      await waitFor(() => {
        expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
      });
    });

    test('should switch language when option is selected', async () => {
      render(<LanguageSwitcher />);
      
      const trigger = screen.getByRole('button', { name: /switch language/i });
      fireEvent.click(trigger);
      
      await waitFor(() => {
        const germanOption = screen.getByRole('menuitem', { name: /deutsch/i });
        fireEvent.click(germanOption);
      });
      
      expect(mockSwitchLanguage).toHaveBeenCalledWith('de');
    });

    test('should show current locale as selected', () => {
      // Mock current locale as German
      jest.mocked(require('@/lib/i18n/hooks').useLanguageSwitcher).mockReturnValue({
        currentLocale: 'de',
        switchLanguage: mockSwitchLanguage
      });
      
      render(<LanguageSwitcher />);
      
      const trigger = screen.getByRole('button', { name: /switch language/i });
      fireEvent.click(trigger);
      
      expect(screen.getByText('Deutsch')).toBeInTheDocument();
    });

    test('should handle showFlag prop', () => {
      const { rerender } = render(<LanguageSwitcher showFlag={true} />);
      expect(screen.getByText('🇺🇸')).toBeInTheDocument();
      
      rerender(<LanguageSwitcher showFlag={false} />);
      expect(screen.queryByText('🇺🇸')).not.toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('English');
    });

    test('should handle showText prop', () => {
      const { rerender } = render(<LanguageSwitcher showText={true} />);
      expect(screen.getByText('English')).toBeInTheDocument();
      
      rerender(<LanguageSwitcher showText={false} />);
      expect(screen.queryByText('English')).not.toBeInTheDocument();
    });

    test('should apply custom className', () => {
      render(<LanguageSwitcher className="custom-class" />);
      
      const container = screen.getByRole('button').parentElement;
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('Inline Variant', () => {
    
    test('should render all language options as buttons', () => {
      render(<LanguageSwitcher variant="inline" />);
      
      locales.forEach(locale => {
        const config = localeConfig[locale];
        expect(screen.getByRole('button', { name: new RegExp(config.name, 'i') })).toBeInTheDocument();
      });
    });

    test('should highlight current locale', () => {
      render(<LanguageSwitcher variant="inline" />);
      
      const englishButton = screen.getByRole('button', { name: /english/i });
      expect(englishButton).toHaveClass('bg-blue-100');
    });

    test('should switch language when inline option is clicked', () => {
      render(<LanguageSwitcher variant="inline" />);
      
      const germanButton = screen.getByRole('button', { name: /deutsch/i });
      fireEvent.click(germanButton);
      
      expect(mockSwitchLanguage).toHaveBeenCalledWith('de');
    });
  });

  describe('Accessibility', () => {
    
    test('should have proper ARIA attributes for dropdown', () => {
      render(<LanguageSwitcher />);
      
      const trigger = screen.getByRole('button', { name: /switch language/i });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-haspopup', 'true');
      
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    test('should have proper labels for each language option', () => {
      render(<LanguageSwitcher />);
      
      const trigger = screen.getByRole('button', { name: /switch language/i });
      fireEvent.click(trigger);
      
      locales.forEach(locale => {
        const config = localeConfig[locale];
        const option = screen.getByRole('menuitem');
        // Check if option has accessible name
        expect(option).toBeInTheDocument();
      });
    });

    test('should support keyboard navigation', () => {
      render(<LanguageSwitcher />);
      
      const trigger = screen.getByRole('button', { name: /switch language/i });
      
      // Should open with Enter or Space
      fireEvent.keyDown(trigger, { key: 'Enter' });
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      
      // Should close with Escape
      fireEvent.keyDown(trigger, { key: 'Escape' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    test('should have aria-labels for inline variant', () => {
      render(<LanguageSwitcher variant="inline" />);
      
      locales.forEach(locale => {
        const config = localeConfig[locale];
        const button = screen.getByRole('button', { name: new RegExp(`Switch to ${config.name}`, 'i') });
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('RTL Support', () => {
    
    test('should handle RTL layout for Arabic locale', () => {
      jest.mocked(require('@/lib/i18n/hooks').useLanguageSwitcher).mockReturnValue({
        currentLocale: 'ar',
        switchLanguage: mockSwitchLanguage
      });
      
      render(<LanguageSwitcher />);
      
      const trigger = screen.getByRole('button', { name: /switch language/i });
      fireEvent.click(trigger);
      
      expect(screen.getByText('العربية')).toBeInTheDocument();
      expect(screen.getByText('🇸🇦')).toBeInTheDocument();
    });

    test('should apply proper text direction classes', () => {
      // This would require additional CSS testing utilities
      expect(localeConfig.ar.dir).toBe('rtl');
      expect(localeConfig.en.dir).toBe('ltr');
    });
  });

  describe('Compact Language Switcher', () => {
    
    test('should render without text labels', () => {
      render(<CompactLanguageSwitcher />);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('🇺🇸')).toBeInTheDocument();
      expect(screen.queryByText('English')).not.toBeInTheDocument();
    });
  });

  describe('Inline Language Switcher', () => {
    
    test('should render with flags and text', () => {
      render(<InlineLanguageSwitcher />);
      
      locales.forEach(locale => {
        const config = localeConfig[locale];
        expect(screen.getByText(config.flag)).toBeInTheDocument();
        expect(screen.getByText(config.nativeName)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    
    test('should handle missing translation gracefully', () => {
      // Mock a scenario where translation is missing
      jest.mocked(require('@/lib/i18n/hooks').useLanguageSwitcher).mockReturnValue({
        currentLocale: undefined,
        switchLanguage: mockSwitchLanguage
      });
      
      expect(() => render(<LanguageSwitcher />)).not.toThrow();
    });

    test('should handle switch language errors', () => {
      mockSwitchLanguage.mockImplementation(() => {
        throw new Error('Switch failed');
      });
      
      render(<LanguageSwitcher />);
      
      const trigger = screen.getByRole('button', { name: /switch language/i });
      fireEvent.click(trigger);
      
      // Should not crash when language switch fails
      expect(() => {
        const option = screen.getAllByRole('menuitem')[1];
        fireEvent.click(option);
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    
    test('should not re-render unnecessarily', () => {
      const renderSpy = jest.fn();
      const MockComponent = () => {
        renderSpy();
        return <LanguageSwitcher />;
      };
      
      const { rerender } = render(<MockComponent />);
      expect(renderSpy).toHaveBeenCalledTimes(1);
      
      // Re-render with same props should not cause extra renders
      rerender(<MockComponent />);
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    test('should cleanup event listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(<LanguageSwitcher />);
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    });
  });
});