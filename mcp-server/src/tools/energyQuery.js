/**
 * MCP Инструмент за анализ на енергийната мрежа в дома
 */
export const energyQueryTool = {
    // 1. Метаданни за Alexa+ (как моделът разбира кога да използва инструмента)
    name: "query_home_energy",
    description: "Анализира текущото потребление на енергия в дома и връща препоръки за спестяване по време на гледане на телевизия.",
    inputSchema: {
        type: "object",
        properties: {
            applianceType: {
                type: "string",
                description: "Типът на уреда, който се проверява (напр. 'cinema', 'lighting', 'hvac').",
                enum: ["cinema", "lighting", "hvac"]
            },
            currentDurationMinutes: {
                type: "number",
                description: "Продължителността на планираната сесия за гледане на филм в минути."
            }
        },
        required: ["applianceType", "currentDurationMinutes"]
    },

    // 2. Бизнес логика (Изпълнява се, когато Alexa+ извика инструмента)
    async handler(argumentsData) {
        const { applianceType, currentDurationMinutes } = argumentsData;
        
        // Симулирани данни от сензори в реално време (може да се свърже с истинско API)
        const mockGridLoadKW = 4.2; // Високо натоварване на мрежата в момента
        const baseRatePerKWh = 0.25; // Цена за kWh
        
        let powerReductionWatts = 0;
        let recommendation = "";

        if (applianceType === "cinema") {
            powerReductionWatts = 150; // Намаляване на подсветката на Fire TV и изключване на ресивъра
            recommendation = `Мрежата е натоварена (${mockGridLoadKW} kW). Ако активирате Eco-Cinema режим, ще намалим яркостта на екрана с 20% и ще изключим неизползваните аудио зони.`;
        } else if (applianceType === "lighting") {
            powerReductionWatts = 80; // Димиране на умните лампи в стаята
            recommendation = "Препоръчвам автоматично димиране на осветлението в хола до 10% за по-добро кино изживяване и спестяване на енергия.";
        }

        // Математическо изчисление на спестяванията
        const hours = currentDurationMinutes / 60;
        const savedKWh = (powerReductionWatts * hours) / 1000;
        const moneySaved = savedKWh * baseRatePerKWh;

        // Връщане на структуриран JSON-RPC отговор, съвместим с MCP
        return {
            content: [
                {
                    type: "text",
                    text: recommendation
                }
            ],
            // Метаданни, които Alexa+ и Vega OS UI (MCP Apps) ще използват за визуализация
            metadata: {
                savedKWh: savedKWh.toFixed(2),
                moneySaved: `$${moneySaved.toFixed(2)}`,
                suggestedAction: "APPLY_ECO_PROFILE"
            }
        };
    }
};
