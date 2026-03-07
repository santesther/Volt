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
                new Object[]{"LOWER_BACK",          72f,  Size.MEDIUM}
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
                        new Object[]{"Supino Reto",              Equipment.FREE_WEIGHT},
                        new Object[]{"Supino Inclinado",         Equipment.FREE_WEIGHT},
                        new Object[]{"Supino Declinado",         Equipment.FREE_WEIGHT},
                        new Object[]{"Supino Reto Máquina",      Equipment.MACHINE},
                        new Object[]{"Supino Inclinado Máquina", Equipment.MACHINE},
                        new Object[]{"Crucifixo",                Equipment.FREE_WEIGHT},
                        new Object[]{"Crucifixo Máquina",        Equipment.MACHINE},
                        new Object[]{"Peck Deck",                Equipment.MACHINE},
                        new Object[]{"Crossover",                Equipment.MACHINE},
                        new Object[]{"Flexão de Braço",          Equipment.FREE_WEIGHT}
                )),

                Map.entry("BACK", List.of(
                        new Object[]{"Puxada Frontal Aberta",    Equipment.MACHINE},
                        new Object[]{"Puxada Frontal Fechada",   Equipment.MACHINE},
                        new Object[]{"Puxada Neutra",            Equipment.MACHINE},
                        new Object[]{"Remada Curvada",           Equipment.FREE_WEIGHT},
                        new Object[]{"Remada Unilateral",        Equipment.FREE_WEIGHT},
                        new Object[]{"Remada Máquina",           Equipment.MACHINE},
                        new Object[]{"Remada Cavalinho",         Equipment.MACHINE},
                        new Object[]{"Levantamento Terra",       Equipment.FREE_WEIGHT},
                        new Object[]{"Pullover",                 Equipment.FREE_WEIGHT},
                        new Object[]{"Barra Fixa",               Equipment.FREE_WEIGHT}
                )),

                Map.entry("SHOULDERS", List.of(
                        new Object[]{"Desenvolvimento com Halteres",  Equipment.FREE_WEIGHT},
                        new Object[]{"Desenvolvimento com Barra",     Equipment.FREE_WEIGHT},
                        new Object[]{"Desenvolvimento Máquina",       Equipment.MACHINE},
                        new Object[]{"Elevação Lateral",              Equipment.FREE_WEIGHT},
                        new Object[]{"Elevação Lateral Máquina",      Equipment.MACHINE},
                        new Object[]{"Elevação Frontal",              Equipment.FREE_WEIGHT},
                        new Object[]{"Arnold Press",                  Equipment.FREE_WEIGHT}
                )),

                Map.entry("POSTERIOR_SHOULDERS", List.of(
                        new Object[]{"Elevação Posterior",            Equipment.FREE_WEIGHT},
                        new Object[]{"Crucifixo Invertido",          Equipment.FREE_WEIGHT},
                        new Object[]{"Puxada Alta para Posterior",   Equipment.MACHINE},
                        new Object[]{"Face Pull",                     Equipment.MACHINE},
                        new Object[]{"Peck Deck Invertido",                     Equipment.MACHINE}
                )),

                Map.entry("TRAPEZIUS", List.of(
                        new Object[]{"Encolhimento com Halteres",    Equipment.FREE_WEIGHT},
                        new Object[]{"Encolhimento com Barra",       Equipment.FREE_WEIGHT},
                        new Object[]{"Encolhimento Máquina",         Equipment.MACHINE},
                        new Object[]{"Remada Alta",                  Equipment.FREE_WEIGHT}
                )),

                Map.entry("BICEPS", List.of(
                        new Object[]{"Rosca Direta com Barra",       Equipment.FREE_WEIGHT},
                        new Object[]{"Rosca Direta com Halteres",    Equipment.FREE_WEIGHT},
                        new Object[]{"Rosca Alternada",              Equipment.FREE_WEIGHT},
                        new Object[]{"Rosca Concentrada",            Equipment.FREE_WEIGHT},
                        new Object[]{"Rosca Scott",                  Equipment.FREE_WEIGHT},
                        new Object[]{"Rosca Máquina",                Equipment.MACHINE},
                        new Object[]{"Rosca Martelo",                Equipment.FREE_WEIGHT},
                        new Object[]{"Rosca 21",                     Equipment.FREE_WEIGHT}
                )),

                Map.entry("TRICEPS", List.of(
                        new Object[]{"Tríceps Pulley",               Equipment.MACHINE},
                        new Object[]{"Tríceps Corda",                Equipment.MACHINE},
                        new Object[]{"Tríceps Testa",                Equipment.FREE_WEIGHT},
                        new Object[]{"Tríceps Francês",              Equipment.FREE_WEIGHT},
                        new Object[]{"Tríceps Máquina",              Equipment.MACHINE}
                )),

                Map.entry("FOREARMS", List.of(
                        new Object[]{"Rosca de Punho",               Equipment.FREE_WEIGHT},
                        new Object[]{"Rosca de Punho Inversa",       Equipment.FREE_WEIGHT},
                        new Object[]{"Rosca de Punho Máquina",       Equipment.MACHINE},
                        new Object[]{"Farmers Walk",                 Equipment.FREE_WEIGHT}
                )),

                Map.entry("LEGS_ANTERIOR", List.of(
                        new Object[]{"Agachamento Livre",            Equipment.FREE_WEIGHT},
                        new Object[]{"Agachamento Hack",             Equipment.MACHINE},
                        new Object[]{"Leg Press 45°",                Equipment.MACHINE},
                        new Object[]{"Leg Press Horizontal",         Equipment.MACHINE},
                        new Object[]{"Extensão de Pernas",           Equipment.MACHINE},
                        new Object[]{"Avanço com Halteres",          Equipment.FREE_WEIGHT},
                        new Object[]{"Avanço com Barra",             Equipment.FREE_WEIGHT},
                        new Object[]{"Agachamento Búlgaro",          Equipment.FREE_WEIGHT},
                        new Object[]{"Cadeira Extensora",            Equipment.MACHINE}
                )),

                Map.entry("LEGS_POSTERIOR", List.of(
                        new Object[]{"Flexão de Pernas",             Equipment.MACHINE},
                        new Object[]{"Mesa Flexora",                 Equipment.MACHINE},
                        new Object[]{"Stiff",                        Equipment.FREE_WEIGHT},
                        new Object[]{"Levantamento Terra Romeno",    Equipment.FREE_WEIGHT},
                        new Object[]{"Cadeira Flexora",              Equipment.MACHINE}
                )),

                Map.entry("GLUTES", List.of(
                        new Object[]{"Hip Thrust",                   Equipment.FREE_WEIGHT},
                        new Object[]{"Hip Thrust Máquina",           Equipment.MACHINE},
                        new Object[]{"Elevação Pélvica",             Equipment.FREE_WEIGHT},
                        new Object[]{"Abdução de Quadril",           Equipment.MACHINE},
                        new Object[]{"Agachamento Sumô",             Equipment.FREE_WEIGHT},
                        new Object[]{"Passada",                      Equipment.FREE_WEIGHT},
                        new Object[]{"Abdutora",          Equipment.MACHINE}
                )),

                Map.entry("CALVES", List.of(
                        new Object[]{"Panturrilha em Pé",            Equipment.MACHINE},
                        new Object[]{"Panturrilha Sentado",          Equipment.MACHINE},
                        new Object[]{"Panturrilha no Leg Press",     Equipment.MACHINE},
                        new Object[]{"Panturrilha Livre",            Equipment.FREE_WEIGHT}
                )),

                Map.entry("ABS", List.of(
                        new Object[]{"Crunch",                       Equipment.FREE_WEIGHT},
                        new Object[]{"Crunch Máquina",               Equipment.MACHINE},
                        new Object[]{"Abdominal Infra",              Equipment.FREE_WEIGHT},
                        new Object[]{"Elevação de Pernas",           Equipment.FREE_WEIGHT},
                        new Object[]{"Abdominal Oblíquo",            Equipment.FREE_WEIGHT},
                        new Object[]{"Roda Abdominal",               Equipment.FREE_WEIGHT}
                )),

                Map.entry("CORE", List.of(
                        new Object[]{"Prancha",                      Equipment.FREE_WEIGHT},
                        new Object[]{"Prancha Lateral",              Equipment.FREE_WEIGHT},
                        new Object[]{"Dead Bug",                     Equipment.FREE_WEIGHT},
                        new Object[]{"Bird Dog",                     Equipment.FREE_WEIGHT},
                        new Object[]{"Hollow Body",                  Equipment.FREE_WEIGHT}
                )),

                Map.entry("LOWER_BACK", List.of(
                        new Object[]{"Hiperextensão",                Equipment.FREE_WEIGHT},
                        new Object[]{"Hiperextensão Máquina",        Equipment.MACHINE},
                        new Object[]{"Levantamento Terra",           Equipment.FREE_WEIGHT},
                        new Object[]{"Superman",                     Equipment.FREE_WEIGHT}
                ))
        );

        exercises.forEach((muscleName, exerciseList) -> {
            muscleGroupRepository.findByName(muscleName).ifPresent(muscleGroup -> {
                for (Object[] ex : exerciseList) {
                    String exName = (String) ex[0];
                    Equipment equipment = (Equipment) ex[1];
                    if (!exerciseRepository.existsByNameAndMuscleGroupId(exName, muscleGroup.getId())) {
                        Exercise exercise = new Exercise();
                        exercise.setName(exName);
                        exercise.setMuscleGroup(muscleGroup);
                        exercise.setEquipment(equipment);
                        exerciseRepository.save(exercise);
                    }
                }
            });
        });
    }
}