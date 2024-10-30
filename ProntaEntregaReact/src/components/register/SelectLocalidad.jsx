import React from "react";
import { Form } from "react-bootstrap";
import AutoCompleteSelect from "../selects/auto_complete_select/auto_complete_select"

const SelectLocalidad = ({ onSelect, onChange }) => {
    const Localidades = [
        
        { key: "1", label: "Achiras, Río Cuarto" },
        { key: "2", label: "Adelia María, Río Cuarto" },
        { key: "3", label: "Agua de Oro, Colón" },
        { key: "4", label: "Alcira Gigena, Río Cuarto" },
        { key: "5", label: "Alejandro Roca, Juárez Celman" },
        { key: "6", label: "Alejo Ledesma, Marcos Juárez" },
        { key: "7", label: "Alicia, San Justo" },
        { key: "8", label: "Almafuerte, Tercero Arriba" },
        { key: "9", label: "Alpa Corral, Río Cuarto" },
        { key: "10", label: "Alta Gracia, Santa María" },
        { key: "11", label: "Alto Alegre, Unión" },
        { key: "12", label: "Altos de Chipión, San Justo" },
        { key: "13", label: "Anisacate, Santa María" },
        { key: "14", label: "Arias, Marcos Juárez" },
        { key: "15", label: "Arroyito, San Justo" },
        { key: "16", label: "Arroyo Algodón, General San Martín" },
        { key: "17", label: "Arroyo Cabral, General San Martín" },
        { key: "18", label: "Ausonia, General San Martín" },
        { key: "19", label: "Ballesteros, Unión" },
        { key: "20", label: "Ballesteros Sud, Unión" },
        { key: "21", label: "Balnearia, San Justo" },
        { key: "22", label: "Bell Ville, Unión" },
        { key: "23", label: "Bengolea, Juárez Celman" },
        { key: "24", label: "Benjamín Gould, Unión" },
        { key: "25", label: "Berrotarán, Río Cuarto" },
        { key: "26", label: "Bialet Massé, Punilla" },
        { key: "27", label: "Bouwer, Santa María" },
        { key: "28", label: "Brinkmann, San Justo" },
        { key: "29", label: "Buchardo, General Roca" },
        { key: "30", label: "Bulnes, Río Cuarto" },
        { key: "31", label: "Calchín, Río Segundo" },
        { key: "32", label: "Calchín Oeste, Río Segundo" },
        { key: "33", label: "Camilo Aldao, Marcos Juárez" },
        { key: "34", label: "Canals, Unión" },
        { key: "35", label: "Capilla del Carmen, Río Segundo" },
        { key: "36", label: "Capilla del Monte, Punilla" },
        { key: "37", label: "Capitán General Begrano O’Higgins, Marcos Juárez" },
        { key: "38", label: "Carnerillo, Juárez Celman" },
        { key: "39", label: "Carrilobo, Río Segundo" },
        { key: "40", label: "Cavanagh, Marcos Juárez" },
        { key: "41", label: "Cañada de Luque, Totoral" },
        { key: "42", label: "Chaján, Río Cuarto" },
        { key: "43", label: "Charras, Juárez Celman" },
        { key: "44", label: "Chazón, General San Martín" },
        { key: "45", label: "Chilibroste, Unión" },
        { key: "46", label: "Cintra, Unión" },
        { key: "47", label: "Colado, Río Segundo" },
        { key: "48", label: "Colonia Almada, Tercero Arriba" },
        { key: "49", label: "Colonia Bismarck, Unión" },
        { key: "50", label: "Colonia Caroya, Colón" },
        { key: "51", label: "Colonia Italiana, Marcos Juárez" },
        { key: "52", label: "Colonia Marina, San Justo" },
        { key: "53", label: "Colonia Prosperidad, San Justo" },
        { key: "54", label: "Colonia San Bartolomé, San Justo" },
        { key: "55", label: "Colonia Tirolesa, Colón" },
        { key: "56", label: "Colonia Vignaud, San Justo" },
        { key: "57", label: "Coronel Baigorria, Río Cuarto" },
        { key: "58", label: "Coronel Moldes, Río Cuarto" },
        { key: "59", label: "Corral de Bustos, Marcos Juárez" },
        { key: "60", label: "Corralito, Tercero Arriba" },
        { key: "61", label: "Cosquín, Punilla" },
        { key: "62", label: "Costa Sacate, Río Segundo" },
        { key: "63", label: "Cruz Alta, Marcos Juárez" },
        { key: "64", label: "Cruz del Eje, Cruz del Eje" },
        { key: "65", label: "Córdoba, Capital" },
        { key: "66", label: "Dalmacio Vélez Sarfield, Tercero Arriba" },
        { key: "67", label: "Del Campillo, General Roca" },
        { key: "68", label: "Despeñaderos, Santa María" },
        { key: "69", label: "Devoto, San Justo" },
        { key: "70", label: "Déan Funes, Ischilín" },
        { key: "71", label: "El Arañado, San Justo" },
        { key: "72", label: "El Brete, Cruz del Eje" },
        { key: "73", label: "El Fortín, San Justo" },
        { key: "74", label: "El Tío, San Justo" },
        { key: "75", label: "Elena, Río Cuarto" },
        { key: "76", label: "Embalse, Calamuchita" },
        { key: "77", label: "Estación General Paz, Colón" },
        { key: "78", label: "Estación Juárez Celman, Colón" },
        { key: "79", label: "Etruria, General San Martín" },
        { key: "80", label: "Freyre, San Justo" },
        { key: "81", label: "General Bladissera, Marcos Juárez" },
        { key: "82", label: "General Cabrera, Juárez Celman" },
        { key: "83", label: "General Deheza, Juárez Celman" },
        { key: "84", label: "General Levalle, Presidente Roque Sáenz Peña" },
        { key: "85", label: "General Roca, Marcos Juárez" },
        { key: "86", label: "Guatimozín, Marcos Juárez" },
        { key: "87", label: "Hernando, Tercero Arriba" },
        { key: "88", label: "Huanchilla, Juárez Celman" },
        { key: "89", label: "Huerta Grande, Punilla" },
        { key: "90", label: "Huinca Renancó, General Roca" },
        { key: "91", label: "Idiazábal, Unión" },
        { key: "92", label: "Iriville, Marcos Juárez" },
        { key: "93", label: "Isla Verde, Marcos Juárez" },
        { key: "94", label: "Italó, General Roca" },
        { key: "95", label: "James Craik, Tercero Arriba" },
        { key: "96", label: "Jesús María, Colón" },
        { key: "97", label: "Jovita, General Roca" },
        { key: "98", label: "Justiniano Posse, Unión" },
        { key: "99", label: "La Calera, Colón" },
        { key: "100", label: "La Carlota, Juárez Celman" },
        { key: "101", label: "La Cautiva, Río Cuarto" },
        { key: "102", label: "La Cesira, Presidente Roque Sáenz Peña" },
        { key: "103", label: "La Cruz, Calamuchita" },
        { key: "104", label: "La Cumbre, Punilla" },
        { key: "105", label: "La Falda, Punilla" },
        { key: "106", label: "La Fragancia, San Justo" },
        { key: "107", label: "La Granja, Colón" },
        { key: "108", label: "La Laguna, General San Martín" },
        { key: "109", label: "La Palestina, General San Martín" },
        { key: "110", label: "La Paquita, San Justo" },
        { key: "111", label: "La Para, Río Primero" },
        { key: "112", label: "La Paz, San Javier" },
        { key: "113", label: "La Playosa, General San Martín" },
        { key: "114", label: "La Puera, Río Primero" },
        { key: "115", label: "La Tordilla, San Justo" },
        { key: "116", label: "Laborde, Unión" },
        { key: "117", label: "Laboulaye, Presidente Roque Sáenz Peña" },
        { key: "118", label: "Laguna Larga, Río Segundo" },
        { key: "119", label: "Las Acequias, Río Cuarto" },
        { key: "120", label: "Las Arrias, Tulumba" },
        { key: "121", label: "Las Higueras, Río Cuarto" },
        { key: "122", label: "Las Junturas, Río Segundo" },
        { key: "123", label: "Las Perdices, Tercero Arriba" },
        { key: "124", label: "Las Peñas, Totoral" },
        { key: "125", label: "Las Tapias, San Javier" },
        { key: "126", label: "Las Varas, San Justo" },
        { key: "127", label: "Las Vatillas, San Justo" },
        { key: "128", label: "Las Vertientes, Río Cuarto" },
        { key: "129", label: "Leones, Marcos Juárez" },
        { key: "130", label: "Los Cerillos, San Javier" },
        { key: "131", label: "Los Cisnes, Juárez Celman" },
        { key: "132", label: "Los Cocos, Punilla" },
        { key: "133", label: "Los Cóndores, Calamuchita" },
        { key: "134", label: "Los Surgentes, Marcos Juárez" },
        { key: "135", label: "Los Zorros, Tercero Arriba" },
        { key: "136", label: "Lozada, Santa María" },
        { key: "137", label: "Luca, General San Martín" },
        { key: "138", label: "Lucio V. Mansilla, Tulumba" },
        { key: "139", label: "Luque, Río Segundo" },
        { key: "140", label: "Malagueño, Santa María" },
        { key: "141", label: "Malvinas Argentinas, Colón" },
        { key: "142", label: "Manfredi, Río Segundo" },
        { key: "143", label: "Marcos Juárez, Marcos Juárez" },
        { key: "144", label: "Marull, San Justo" },
        { key: "145", label: "Matorrales, Río Segundo" },
        { key: "146", label: "Mattaldi, General Roca" },
        { key: "147", label: "Melo, Presidente Roque Sáenz Peña" },
        { key: "148", label: "Mendiolaza, Colón" },
        { key: "149", label: "Mi Granja, Colón" },
        { key: "150", label: "Mina Clavero, San Alberto" },
        { key: "151", label: "Miramar de Ansenuza, San Justo" },
        { key: "152", label: "Monte Buey, Marcos Juárez" },
        { key: "153", label: "Monte Cristo, Río Primero" },
        { key: "154", label: "Monte de los Gauchos, Río Cuarto" },
        { key: "155", label: "Monte Leña, Unión" },
        { key: "156", label: "Monte Maíz, Unión" },
        { key: "157", label: "Monte Ralo, Santa María" },
        { key: "158", label: "Morrison, Unión" },
        { key: "159", label: "Morteros, San Justo" },
        { key: "160", label: "Noetinger, Unión" },
        { key: "161", label: "Nono, San Alberto" },
        { key: "162", label: "Obispo Trejo, Río Primero" },
        { key: "163", label: "Olaeta, Juárez Celman" },
        { key: "164", label: "Oliva, Tercero Arriba" },
        { key: "165", label: "Oncativo, Río Segundo" },
        { key: "166", label: "Ordoñez, Unión" },
        { key: "167", label: "Pampayasta Sud, Tercero Arriba" },
        { key: "168", label: "Pascanas, Unión" },
        { key: "169", label: "Pasco, General San Martín" },
        { key: "170", label: "Pilar, Río Segundo" },
        { key: "171", label: "Piquillín, Río Primero" },
        { key: "172", label: "Porteña, San Justo" },
        { key: "173", label: "Pozo del Molle, Río Segundo" },
        { key: "174", label: "Pueblo Italiano, Unión" },
        { key: "175", label: "Quebracho Herrado, San Justo" },
        { key: "176", label: "Quilino, Ischilín" },
        { key: "177", label: "Reducción, Juárez Celman" },
        { key: "178", label: "Rosales, Presidente Roque Sáenz Peña" },
        { key: "179", label: "Río Ceballos, Colón" },
        { key: "180", label: "Río Cuarto, Río Cuarto" },
        { key: "181", label: "Río de los Sauces, Calamuchita" },
        { key: "182", label: "Río Primero, Río Primero" },
        { key: "183", label: "Río Segundo, Río Segundo" },
        { key: "184", label: "Río Tercero, Tercero Arriba" },
        { key: "185", label: "Sacanta, San Justo" },
        { key: "186", label: "Saira, Marcos Juárez" },
        { key: "187", label: "Saldán, Colón" },
        { key: "188", label: "Salsacate, Pocho" },
        { key: "189", label: "Salsipuedes, Colón" },
        { key: "190", label: "Sampacho, Río Cuarto" },
        { key: "191", label: "San Agustín, Calamuchita" },
        { key: "192", label: "San Antonio de Arredondo, Punilla" },
        { key: "193", label: "San Antonio de Litín, Unión" },
        { key: "194", label: "San Basilio, Río Cuarto" },
        { key: "195", label: "San Carlos Minas, Minas" },
        { key: "196", label: "San Esteban, Punilla" },
        { key: "197", label: "San Francisco, San Justo" },
        { key: "198", label: "San Francisco del Chañar, Sobremonte" },
        { key: "199", label: "San Javier y Yacanto, San Javier" },
        { key: "200", label: "San José, San Javier" },
        { key: "201", label: "San José de la Dormida, Tulumba" },
        { key: "202", label: "San José de las Salinas, Tulumba" },
        { key: "203", label: "San Marcos Sierras, Cruz del Eje" },
        { key: "204", label: "San Marcos Sud, Unión" },
        { key: "205", label: "San Pedro, San Alberto" },
        { key: "206", label: "San Pedro Norte, Tulumba" },
        { key: "207", label: "Santa Catalina/Holmberg, Río Cuarto" },
        { key: "208", label: "Santa Eufemia, Juárez Celman" },
        { key: "209", label: "Santa María de Punilla, Punilla" },
        { key: "210", label: "Santa Rosa de Calamuchita, Calamuchita" },
        { key: "211", label: "Santa Rosa de Río Primero, Río Primero" },
        { key: "212", label: "Santiago Temple, Río Segundo" },
        { key: "213", label: "Sarmiento, Totoral" },
        { key: "214", label: "Saturnino María Laspiur, San Justo" },
        { key: "215", label: "Sebastián Elcano, Río Seco" },
        { key: "216", label: "Seeber, San Justo" },
        { key: "217", label: "Serrezuela, Cruz del Eje" },
        { key: "218", label: "Silvio Pellico, General San Martín" },
        { key: "219", label: "Sinsacate, Totoral" },
        { key: "220", label: "Tancacha, Tercero Arriba" },
        { key: "221", label: "Tanti, Punilla" },
        { key: "222", label: "Ticino, General San Martín" },
        { key: "223", label: "Toledo, Santa María" },
        { key: "224", label: "Tosquita, Río Cuarto" },
        { key: "225", label: "Tránsito, San Justo" },
        { key: "226", label: "Tío Pujio, General San Martín" },
        { key: "227", label: "Ucacha, Juárez Celman" },
        { key: "228", label: "Unquillo, Colón" },
        { key: "229", label: "Valle Hermoso, Punilla" },
        { key: "230", label: "Viamonte, Unión" },
        { key: "231", label: "Vicuña Mackenna, Río Cuarto" },
        { key: "232", label: "Villa Allende, Colón" },
        { key: "233", label: "Villa Ascasubi, Tercero Arriba" },
        { key: "234", label: "Villa Carlos Paz, Punilla" },
        { key: "235", label: "Villa Concepción del Tío, San Justo" },
        { key: "236", label: "Villa Cura Brochero, San Alberto" },
        { key: "237", label: "Villa de las Rosas, San Javier" },
        { key: "238", label: "Villa de María del Río Seco, Río Seco" },
        { key: "239", label: "Villa del Soto, Cruz del Eje" },
        { key: "240", label: "Villa del Dique, Calamuchita" },
        { key: "241", label: "Villa del Rosario, Río Segundo" },
        { key: "242", label: "Villa del Totoral, Totoral" },
        { key: "243", label: "Villa Dolores, San Javier" },
        { key: "244", label: "Villa Fontana, Río Primero" },
        { key: "245", label: "Villa General Belgrano, Calamuchita" },
        { key: "246", label: "Villa Giardino, Punilla" },
        { key: "247", label: "Villa Huidobro, General Roca" },
        { key: "248", label: "Villa Icho Cruz, Punilla" },
        { key: "249", label: "Villa María, General San Martín" },
        { key: "250", label: "Villa Nueva, General San Martín" },
        { key: "251", label: "Villa Parque Santa Ana, Santa María" },
        { key: "252", label: "Villa Rossi, Presidente Roque Sáenz Peña" },
        { key: "253", label: "Villa Rumipal, Calamuchita" },
        { key: "254", label: "Villa Santa Cruz del Lago, Punilla" },
        { key: "255", label: "Villa Sarmiento, San Alberto" },
        { key: "256", label: "Villa Tulumba, Tulumba" },
        { key: "257", label: "Villa Valeria, General Roca" },
        { key: "258", label: "Villa Yacanto, Calamuchita" },
        { key: "259", label: "Wenceslao Escalante, Unión" }
        
      ]
      
    return(
        <AutoCompleteSelect
            lists={Localidades}
            onClick={onSelect}
            onInputChange={onChange}
            width="95%"
        />
    );
} 
export default SelectLocalidad;