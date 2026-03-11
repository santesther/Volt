package com.personal.fitanalyzer.config;

import com.personal.fitanalyzer.domain.Exercise;
import com.personal.fitanalyzer.domain.MuscleGroups;
import com.personal.fitanalyzer.domain.enums.Equipment;
import com.personal.fitanalyzer.domain.enums.Size;
import com.personal.fitanalyzer.repository.ExerciseRepository;
import com.personal.fitanalyzer.repository.MuscleGroupRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@Order(2)
public class DataInitializer implements ApplicationRunner {

    private final MuscleGroupRepository muscleGroupRepository;
    private final ExerciseRepository exerciseRepository;

    public DataInitializer(MuscleGroupRepository muscleGroupRepository, ExerciseRepository exerciseRepository) {
        this.muscleGroupRepository = muscleGroupRepository;
        this.exerciseRepository = exerciseRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        initMuscleGroups();
        initExercises();
    }

    private void initMuscleGroups() {
        List<Object[]> groups = List.of(
                new Object[]{"CHEST",               72f,  Size.LARGE},
                new Object[]{"BACK",                72f,  Size.LARGE},
                new Object[]{"SHOULDERS",           48f,  Size.MEDIUM},
                new Object[]{"POSTERIOR_SHOULDERS", 48f,  Size.SMALL},
                new Object[]{"TRAPEZIUS",           48f,  Size.MEDIUM},
                new Object[]{"BICEPS",              48f,  Size.SMALL},
                new Object[]{"TRICEPS",             48f,  Size.SMALL},
                new Object[]{"FOREARMS",            24f,  Size.SMALL},
                new Object[]{"LEGS_ANTERIOR",       96f,  Size.LARGE},
                new Object[]{"LEGS_POSTERIOR",      96f,  Size.LARGE},
                new Object[]{"GLUTES",              72f,  Size.LARGE},
                new Object[]{"CALVES",              48f,  Size.SMALL},
                new Object[]{"ABS",                 24f,  Size.MEDIUM},
                new Object[]{"CORE",                24f,  Size.MEDIUM},
                new Object[]{"LOWER_BACK",          72f,  Size.MEDIUM},
                new Object[]{"KNEES",               72f,  Size.SMALL}
        );

        for (Object[] g : groups) {
            String name = (String) g[0];
            if (!muscleGroupRepository.existsByName(name)) {
                MuscleGroups mg = new MuscleGroups();
                mg.setName(name);
                mg.setRecoveryHours((Float) g[1]);
                mg.setSize((Size) g[2]);
                muscleGroupRepository.save(mg);
            }
        }
    }

    private void initExercises() {
        Map<String, List<Object[]>> exercises = Map.ofEntries(

                Map.entry("CHEST", List.of(
                        new Object[]{"Supino Reto",              "Flat Bench Press",          Equipment.FREE_WEIGHT},
                        new Object[]{"Supino Inclinado",         "Incline Bench Press",       Equipment.FREE_WEIGHT},
                        new Object[]{"Supino Declinado",         "Decline Bench Press",       Equipment.FREE_WEIGHT},
                        new Object[]{"Supino Reto Máquina",      "Machine Chest Press",       Equipment.MACHINE},
                        new Object[]{"Supino Inclinado Máquina", "Incline Machine Press",     Equipment.MACHINE},
                        new Object[]{"Crucifixo",                "Dumbbell Fly",              Equipment.FREE_WEIGHT},
                        new Object[]{"Crucifixo Máquina",        "Machine Fly",               Equipment.MACHINE},
                        new Object[]{"Peck Deck",                "Pec Deck",                  Equipment.MACHINE},
                        new Object[]{"Crossover",                "Cable Crossover",           Equipment.MACHINE},
                        new Object[]{"Flexão de Braço",          "Push-Up",                   Equipment.FREE_WEIGHT}
                )),

                Map.entry("BACK", List.of(
                        new Object[]{"Puxada Frontal Aberta",    "Wide-Grip Lat Pulldown",    Equipment.MACHINE},
                        new Object[]{"Puxada Frontal Fechada",   "Close-Grip Lat Pulldown",   Equipment.MACHINE},
                        new Object[]{"Puxada Neutra",            "Neutral-Grip Pulldown",     Equipment.MACHINE},
                        new Object[]{"Remada Curvada",           "Bent-Over Row",             Equipment.FREE_WEIGHT},
                        new Object[]{"Remada Unilateral",        "Single-Arm Dumbbell Row",   Equipment.FREE_WEIGHT},
                        new Object[]{"Remada Máquina",           "Seated Cable Row",          Equipment.MACHINE},
                        new Object[]{"Remada Cavalinho",         "T-Bar Row",                 Equipment.MACHINE},
                        new Object[]{"Levantamento Terra",       "Deadlift",                  Equipment.FREE_WEIGHT},
                        new Object[]{"Pullover",                 "Pullover",                  Equipment.FREE_WEIGHT},
                        new Object[]{"Barra Fixa",               "Pull-Up",                   Equipment.FREE_WEIGHT}
                )),

                Map.entry("SHOULDERS", List.of(
                        new Object[]{"Desenvolvimento com Halteres",  "Dumbbell Shoulder Press",  Equipment.FREE_WEIGHT},
                        new Object[]{"Desenvolvimento com Barra",     "Barbell Overhead Press",   Equipment.FREE_WEIGHT},
                        new Object[]{"Desenvolvimento Máquina",       "Machine Shoulder Press",   Equipment.MACHINE},
                        new Object[]{"Elevação Lateral",              "Lateral Raise",            Equipment.FREE_WEIGHT},
                        new Object[]{"Elevação Lateral Máquina",      "Machine Lateral Raise",    Equipment.MACHINE},
                        new Object[]{"Elevação Frontal",              "Front Raise",              Equipment.FREE_WEIGHT},
                        new Object[]{"Arnold Press",                  "Arnold Press",             Equipment.FREE_WEIGHT}
                )),

                Map.entry("POSTERIOR_SHOULDERS", List.of(
                        new Object[]{"Elevação Posterior",            "Rear Delt Raise",          Equipment.FREE_WEIGHT},
                        new Object[]{"Crucifixo Invertido",           "Reverse Fly",              Equipment.FREE_WEIGHT},
                        new Object[]{"Puxada Alta para Posterior",    "High Cable Rear Delt Fly", Equipment.MACHINE},
                        new Object[]{"Face Pull",                     "Face Pull",                Equipment.MACHINE},
                        new Object[]{"Peck Deck Invertido",           "Reverse Pec Deck",         Equipment.MACHINE}
                )),

                Map.entry("TRAPEZIUS", List.of(
                        new Object[]{"Encolhimento com Halteres",    "Dumbbell Shrug",           Equipment.FREE_WEIGHT},
                        new Object[]{"Encolhimento com Barra",       "Barbell Shrug",            Equipment.FREE_WEIGHT},
                        new Object[]{"Encolhimento Máquina",         "Machine Shrug",            Equipment.MACHINE},
                        new Object[]{"Remada Alta",                  "Upright Row",              Equipment.FREE_WEIGHT}
                )),

                Map.entry("BICEPS", List.of(
                        new Object[]{"Rosca Direta com Barra",       "Barbell Curl",             Equipment.FREE_WEIGHT},
                        new Object[]{"Rosca Direta com Halteres",    "Dumbbell Curl",            Equipment.FREE_WEIGHT},
                        new Object[]{"Rosca Alternada",              "Alternating Curl",         Equipment.FREE_WEIGHT},
                        new Object[]{"Rosca Concentrada",            "Concentration Curl",       Equipment.FREE_WEIGHT},
                        new Object[]{"Rosca Scott",                  "Preacher Curl",            Equipment.FREE_WEIGHT},
                        new Object[]{"Rosca Máquina",                "Machine Curl",             Equipment.MACHINE},
                        new Object[]{"Rosca Martelo",                "Hammer Curl",              Equipment.FREE_WEIGHT},
                        new Object[]{"Rosca 21",                     "21s Curl",                 Equipment.FREE_WEIGHT}
                )),

                Map.entry("TRICEPS", List.of(
                        new Object[]{"Tríceps Pulley",               "Tricep Pushdown",          Equipment.MACHINE},
                        new Object[]{"Tríceps Corda",                "Rope Pushdown",            Equipment.MACHINE},
                        new Object[]{"Tríceps Testa",                "Skull Crusher",            Equipment.FREE_WEIGHT},
                        new Object[]{"Tríceps Francês",              "French Press",             Equipment.FREE_WEIGHT},
                        new Object[]{"Tríceps Máquina",              "Machine Tricep Extension", Equipment.MACHINE}
                )),

                Map.entry("FOREARMS", List.of(
                        new Object[]{"Rosca de Punho",               "Wrist Curl",               Equipment.FREE_WEIGHT},
                        new Object[]{"Rosca de Punho Inversa",       "Reverse Wrist Curl",       Equipment.FREE_WEIGHT},
                        new Object[]{"Rosca de Punho Máquina",       "Machine Wrist Curl",       Equipment.MACHINE},
                        new Object[]{"Farmers Walk",                 "Farmer's Walk",            Equipment.FREE_WEIGHT}
                )),

                Map.entry("LEGS_ANTERIOR", List.of(
                        new Object[]{"Agachamento Livre",            "Barbell Squat",            Equipment.FREE_WEIGHT},
                        new Object[]{"Agachamento Hack",             "Hack Squat",               Equipment.MACHINE},
                        new Object[]{"Leg Press 45°",                "45° Leg Press",            Equipment.MACHINE},
                        new Object[]{"Leg Press Horizontal",         "Horizontal Leg Press",     Equipment.MACHINE},
                        new Object[]{"Extensão de Pernas",           "Leg Extension",            Equipment.MACHINE},
                        new Object[]{"Avanço com Halteres",          "Dumbbell Lunge",           Equipment.FREE_WEIGHT},
                        new Object[]{"Avanço com Barra",             "Barbell Lunge",            Equipment.FREE_WEIGHT},
                        new Object[]{"Agachamento Búlgaro",          "Bulgarian Split Squat",    Equipment.FREE_WEIGHT},
                        new Object[]{"Cadeira Extensora",            "Leg Extension Machine",    Equipment.MACHINE}
                )),

                Map.entry("LEGS_POSTERIOR", List.of(
                        new Object[]{"Flexão de Pernas",             "Lying Leg Curl",           Equipment.MACHINE},
                        new Object[]{"Mesa Flexora",                 "Prone Leg Curl",           Equipment.MACHINE},
                        new Object[]{"Stiff",                        "Stiff-Leg Deadlift",       Equipment.FREE_WEIGHT},
                        new Object[]{"Levantamento Terra Romeno",    "Romanian Deadlift",        Equipment.FREE_WEIGHT},
                        new Object[]{"Cadeira Flexora",              "Seated Leg Curl",          Equipment.MACHINE}
                )),

                Map.entry("GLUTES", List.of(
                        new Object[]{"Hip Thrust",                   "Hip Thrust",               Equipment.FREE_WEIGHT},
                        new Object[]{"Hip Thrust Máquina",           "Machine Hip Thrust",       Equipment.MACHINE},
                        new Object[]{"Elevação Pélvica",             "Glute Bridge",             Equipment.FREE_WEIGHT},
                        new Object[]{"Abdução de Quadril",           "Hip Abduction",            Equipment.MACHINE},
                        new Object[]{"Agachamento Sumô",             "Sumo Squat",               Equipment.FREE_WEIGHT},
                        new Object[]{"Passada",                      "Lunge",                    Equipment.FREE_WEIGHT},
                        new Object[]{"Abdutora",                     "Hip Abductor Machine",     Equipment.MACHINE}
                )),

                Map.entry("CALVES", List.of(
                        new Object[]{"Panturrilha em Pé",            "Standing Calf Raise",      Equipment.MACHINE},
                        new Object[]{"Panturrilha Sentado",          "Seated Calf Raise",        Equipment.MACHINE},
                        new Object[]{"Panturrilha no Leg Press",     "Leg Press Calf Raise",     Equipment.MACHINE},
                        new Object[]{"Panturrilha Livre",            "Bodyweight Calf Raise",    Equipment.FREE_WEIGHT}
                )),

                Map.entry("ABS", List.of(
                        new Object[]{"Crunch",                       "Crunch",                   Equipment.FREE_WEIGHT},
                        new Object[]{"Crunch Máquina",               "Machine Crunch",           Equipment.MACHINE},
                        new Object[]{"Abdominal Infra",              "Reverse Crunch",           Equipment.FREE_WEIGHT},
                        new Object[]{"Elevação de Pernas",           "Leg Raise",                Equipment.FREE_WEIGHT},
                        new Object[]{"Abdominal Oblíquo",            "Oblique Crunch",           Equipment.FREE_WEIGHT},
                        new Object[]{"Roda Abdominal",               "Ab Wheel Rollout",         Equipment.FREE_WEIGHT}
                )),

                Map.entry("CORE", List.of(
                        new Object[]{"Prancha",                      "Plank",                    Equipment.FREE_WEIGHT},
                        new Object[]{"Prancha Lateral",              "Side Plank",               Equipment.FREE_WEIGHT},
                        new Object[]{"Dead Bug",                     "Dead Bug",                 Equipment.FREE_WEIGHT},
                        new Object[]{"Bird Dog",                     "Bird Dog",                 Equipment.FREE_WEIGHT},
                        new Object[]{"Hollow Body",                  "Hollow Body Hold",         Equipment.FREE_WEIGHT}
                )),

                Map.entry("LOWER_BACK", List.of(
                        new Object[]{"Hiperextensão",                "Back Extension",           Equipment.FREE_WEIGHT},
                        new Object[]{"Hiperextensão Máquina",        "Machine Back Extension",   Equipment.MACHINE},
                        new Object[]{"Levantamento Terra",           "Deadlift",                 Equipment.FREE_WEIGHT},
                        new Object[]{"Superman",                     "Superman Hold",            Equipment.FREE_WEIGHT}
                ))
        );

        exercises.forEach((muscleName, exerciseList) -> {
            muscleGroupRepository.findByName(muscleName).ifPresent(muscleGroup -> {
                for (Object[] ex : exerciseList) {
                    String exName   = (String) ex[0];
                    String exNameEn = (String) ex[1];
                    Equipment equipment = (Equipment) ex[2];
                    if (!exerciseRepository.existsByNameAndMuscleGroupId(exName, muscleGroup.getId())) {
                        Exercise exercise = new Exercise();
                        exercise.setName(exName);
                        exercise.setNameEn(exNameEn);
                        exercise.setMuscleGroup(muscleGroup);
                        exercise.setEquipment(equipment);
                        exerciseRepository.save(exercise);
                    } else {
                        exerciseRepository.findByNameAndMuscleGroupId(exName, muscleGroup.getId())
                                .ifPresent(existing -> {
                                    if (existing.getNameEn() == null) {
                                        existing.setNameEn(exNameEn);
                                        exerciseRepository.save(existing);
                                    }
                                });
                    }
                }
            });
        });
    }
}