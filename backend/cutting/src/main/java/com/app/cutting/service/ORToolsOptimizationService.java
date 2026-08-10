package com.app.cutting.service;

import com.app.cutting.domain.OptimizationJob;
import com.app.cutting.dto.CutRequirement;
import com.app.cutting.repository.OptimizationJobRepository;
import com.google.ortools.Loader;
import com.google.ortools.sat.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ORToolsOptimizationService {

    private final OptimizationJobRepository optimizationJobRepository;

    private static final long STOCK_LENGTH_MM = 6000;

    static {
        // Load the native OR-Tools library
        try {
            Loader.loadNativeLibraries();
        } catch (Exception e) {
            System.err.println("Failed to load OR-Tools native libraries: " + e.getMessage());
        }
    }

    public ORToolsOptimizationService(OptimizationJobRepository optimizationJobRepository) {
        this.optimizationJobRepository = optimizationJobRepository;
    }

    @Async
    public void optimizeExact(OptimizationJob job, List<CutRequirement> requirements) {
        job.setStatus("RUNNING");
        optimizationJobRepository.save(job);

        try {
            long[] items = requirements.stream().mapToLong(r -> r.getLengthMm().longValue()).toArray();
            int numItems = items.length;
            int numBins = numItems; // Worst case: 1 item per bin

            CpModel model = new CpModel();

            // Variables
            // x[i][j] = 1 if item i is packed in bin j.
            IntVar[][] x = new IntVar[numItems][numBins];
            for (int i = 0; i < numItems; i++) {
                for (int j = 0; j < numBins; j++) {
                    x[i][j] = model.newBoolVar("x_" + i + "_" + j);
                }
            }

            // y[j] = 1 if bin j is used.
            IntVar[] y = new IntVar[numBins];
            for (int j = 0; j < numBins; j++) {
                y[j] = model.newBoolVar("y_" + j);
            }

            // Constraints
            // Each item must be in exactly one bin.
            for (int i = 0; i < numItems; i++) {
                model.addEquality(LinearExpr.sum(x[i]), 1);
            }

            // The amount packed in each bin cannot exceed its capacity.
            for (int j = 0; j < numBins; j++) {
                LinearExprBuilder weight = LinearExpr.newBuilder();
                for (int i = 0; i < numItems; i++) {
                    weight.addTerm(x[i][j], items[i]);
                }
                // weight <= y[j] * STOCK_LENGTH_MM
                LinearExprBuilder capacity = LinearExpr.newBuilder();
                capacity.addTerm(y[j], STOCK_LENGTH_MM);
                model.addLessOrEqual(weight, capacity);
            }

            // Objective: minimize the number of bins used.
            model.minimize(LinearExpr.sum(y));

            // Solve
            CpSolver solver = new CpSolver();
            solver.getParameters().setMaxTimeInSeconds(30.0); // Limit solve time for web request safety
            CpSolverStatus status = solver.solve(model);

            if (status == CpSolverStatus.OPTIMAL || status == CpSolverStatus.FEASIBLE) {
                int usedBins = (int) solver.objectiveValue();
                String resultJson = "{\"status\": \"" + status + "\", \"stockBarsUsed\": " + usedBins + "}";
                job.setResultJson(resultJson);
                job.setStatus("COMPLETED");
            } else {
                job.setResultJson("{\"error\": \"Could not find a feasible solution\"}");
                job.setStatus("FAILED");
            }

        } catch (Exception e) {
            job.setResultJson("{\"error\": \"" + e.getMessage() + "\"}");
            job.setStatus("FAILED");
        }

        optimizationJobRepository.save(job);
    }
}
