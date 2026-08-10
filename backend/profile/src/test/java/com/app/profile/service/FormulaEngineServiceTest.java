package com.app.profile.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SuppressWarnings("deprecation")
class FormulaEngineServiceTest {

    private FormulaEngineService formulaEngineService;

    @BeforeEach
    void setUp() {
        formulaEngineService = new FormulaEngineService();
    }

    @Test
    void testCasementWindowAreaCalculation() {
        // The R40 Casement Window example (12.46 Sq.Ft)
        // Assuming inputs in inches, Area in Sq.Ft = (W * H) / 144
        // Example inputs to yield ~12.46 Sq.Ft
        // 42.0 * 42.72 = 1794.24
        // 1794.24 / 144 = 12.46
        
        String expression = "(W * H) / 144";
        Map<String, Double> variables = new HashMap<>();
        variables.put("W", 42.0);
        variables.put("H", 42.72);

        double result = formulaEngineService.evaluate(expression, variables);
        
        // Asserting with a delta of 0.01 for floating point precision
        assertEquals(12.46, result, 0.01, "Area calculation should match 12.46 Sq.Ft");
    }

    @Test
    void testPriceCalculation() {
        // Example price calculation based on Sq.Ft and deduction
        // Formula: ( (W * H) / 144 ) * price_per_sqft
        // Or if using total area * 150
        
        String expression = "((W * H) / 144) * price_per_sqft";
        Map<String, Double> variables = new HashMap<>();
        variables.put("W", 42.0);
        variables.put("H", 42.72);
        variables.put("price_per_sqft", 150.0); // e.g., Hivik Handle price or arbitrary price

        double result = formulaEngineService.evaluate(expression, variables);
        
        // 12.46 * 150 = 1869.0
        assertEquals(1869.0, result, 0.5, "Price calculation should match expected total");
    }

    @Test
    void testEvaluateWithDeduction() {
        // "2*(W+H)-4*deduction" as mentioned in the prompt
        String expression = "2 * (W + H) - 4 * deduction";
        Map<String, Double> variables = new HashMap<>();
        variables.put("W", 42.0);
        variables.put("H", 42.72);
        variables.put("deduction", 1.5);

        double result = formulaEngineService.evaluate(expression, variables);
        
        // 2 * (84.72) - 6.0 = 169.44 - 6.0 = 163.44
        assertEquals(163.44, result, 0.01);
    }
}
