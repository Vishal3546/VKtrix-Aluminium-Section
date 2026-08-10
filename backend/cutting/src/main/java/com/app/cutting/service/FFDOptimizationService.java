package com.app.cutting.service;

import com.app.cutting.domain.OffcutBank;
import com.app.cutting.dto.CutRequirement;
import com.app.cutting.dto.OptimizationResult;
import com.app.cutting.repository.OffcutBankRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class FFDOptimizationService {

    private final OffcutBankRepository offcutBankRepository;

    private static final double STOCK_LENGTH_MM = 6000.0;
    private static final double OFFCUT_THRESHOLD_MM = 500.0;

    public FFDOptimizationService(OffcutBankRepository offcutBankRepository) {
        this.offcutBankRepository = offcutBankRepository;
    }

    @Transactional(readOnly = true)
    public OptimizationResult estimateOptimization(List<CutRequirement> requirements) {
        // Group by profile type and color
        Map<String, List<Double>> groupedCuts = new HashMap<>();
        for (CutRequirement req : requirements) {
            String key = req.getProfileType() + "|" + req.getColor();
            groupedCuts.computeIfAbsent(key, k -> new ArrayList<>()).add(req.getLengthMm());
        }

        OptimizationResult totalResult = new OptimizationResult();
        totalResult.setNewOffcuts(new ArrayList<>());
        int totalBars = 0;
        int totalOffcutsUsed = 0;
        double totalRequiredLength = 0;

        for (Map.Entry<String, List<Double>> entry : groupedCuts.entrySet()) {
            String[] parts = entry.getKey().split("\\|");
            String profileType = parts[0];
            String color = parts.length > 1 ? parts[1] : "";

            List<Double> cuts = entry.getValue();
            cuts.sort(Collections.reverseOrder()); // Descending for FFD

            // Fetch available offcuts
            List<OffcutBank> availableOffcuts = offcutBankRepository
                    .findByIsUsedFalseAndProfileTypeAndColorOrderByLengthMmDesc(profileType, color);
            
            // Convert to a mutable list of remaining lengths
            List<Double> offcutLengths = new ArrayList<>();
            for (OffcutBank ob : availableOffcuts) {
                offcutLengths.add(ob.getLengthMm());
            }

            List<Double> stockBars = new ArrayList<>(); // Track remaining capacity in newly opened bars

            for (Double cut : cuts) {
                totalRequiredLength += cut;
                boolean placed = false;

                // 1. Try to fit in existing offcuts first
                for (int i = 0; i < offcutLengths.size(); i++) {
                    if (offcutLengths.get(i) >= cut) {
                        offcutLengths.set(i, offcutLengths.get(i) - cut);
                        placed = true;
                        totalOffcutsUsed++;
                        break;
                    }
                }

                if (placed) continue;

                // 2. Try to fit in already opened fresh bars
                for (int i = 0; i < stockBars.size(); i++) {
                    if (stockBars.get(i) >= cut) {
                        stockBars.set(i, stockBars.get(i) - cut);
                        placed = true;
                        break;
                    }
                }

                if (placed) continue;

                // 3. Open a new stock bar
                totalBars++;
                stockBars.add(STOCK_LENGTH_MM - cut);
            }

            // Collect resulting new offcuts (from fresh bars and old offcuts) > threshold
            for (Double remain : stockBars) {
                if (remain >= OFFCUT_THRESHOLD_MM) {
                    totalResult.getNewOffcuts().add(remain);
                }
            }
            for (Double remain : offcutLengths) {
                if (remain >= OFFCUT_THRESHOLD_MM) {
                    totalResult.getNewOffcuts().add(remain);
                }
            }
        }

        totalResult.setStockBarsUsed(totalBars);
        totalResult.setOffcutsUsed(totalOffcutsUsed);
        
        // A better scrap calculation: (Total material consumed - Total required) / Total material consumed
        // Assuming we are consuming full fresh bars, and the full length of the offcuts we touched.
        // For simple estimation, scrap % is total leftover / total opened length
        double totalOpenedLength = totalBars * STOCK_LENGTH_MM;
        double scrapAndOffcut = totalOpenedLength - totalRequiredLength; // Rough estimate ignoring previous offcut sizes
        
        if (totalOpenedLength > 0) {
            totalResult.setScrapPercentage((scrapAndOffcut / totalOpenedLength) * 100.0);
        } else {
            totalResult.setScrapPercentage(0.0);
        }

        return totalResult;
    }
}
