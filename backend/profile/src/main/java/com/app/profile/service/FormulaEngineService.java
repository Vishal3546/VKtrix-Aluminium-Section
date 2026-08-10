package com.app.profile.service;

import net.objecthunter.exp4j.Expression;
import net.objecthunter.exp4j.ExpressionBuilder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
@Deprecated
public class FormulaEngineService {

    /**
     * Evaluates a mathematical expression using exp4j.
     * 
     * @param expression The mathematical formula string, e.g. "W * H / 144"
     * @param variables  A map of variable names to their double values, e.g. {"W": 42.0, "H": 42.72}
     * @return The evaluated result
     */
    @Deprecated
    public double evaluate(String expression, Map<String, Double> variables) {
        if (expression == null || expression.trim().isEmpty()) {
            throw new IllegalArgumentException("Expression cannot be empty");
        }

        ExpressionBuilder builder = new ExpressionBuilder(expression);
        
        if (variables != null && !variables.isEmpty()) {
            Set<String> variableNames = variables.keySet();
            builder.variables(variableNames);
        }

        Expression exp = builder.build();

        if (variables != null && !variables.isEmpty()) {
            for (Map.Entry<String, Double> entry : variables.entrySet()) {
                exp.setVariable(entry.getKey(), entry.getValue());
            }
        }

        return exp.evaluate();
    }
}
