const fs = require('fs')
let arg = process.argv;

function count(string) { // функция считает количество каждого элемента строки
    return string.split("").reduce((a, letter) => { // разбиваем строку посимвольно и вызываем функцию обрат.вызова один раз для каждого элемента массива в порядке возрастания индекса
        var currentCount = a[letter];
        if (currentCount) {
            currentCount = currentCount + 1; // если ранее считалось + 1
        } else {
            currentCount = 1; // иначе инициализировать с первым появлением
        }
        a[letter] = currentCount; //заводим новый отсчёт
        return a;
    }, {});
}
// ^ по завершению функции получаем объект, состоящий из элементов типа ключ:свойство (буква: кол-во)

function makingarray(string){
    return Object.entries(string).map(([k,v])=>[v,k])
}
// ^ преобразование в массив + поменяны местами буквы и их кол-ва

function sorted(string) {
    return string.sort(([a, b], [c, d]) => a - c);
}
// ^ сортировка массива массивов в порядке возрастания

function buildTree(tuples)
{
    while(tuples.length>1)
    {
        leastTwo=[tuples[0][1],tuples[1][1]] // складывает в один массив два наименьших узла
        theRest=tuples.slice(2,tuples.length); // обрезает первые два наименьших узла
        combFreq=tuples[0][0]+tuples[1][0]; // сумма значений двух наименьших узлов
        tuples=theRest; // т.к. значения мы уже зафиксировали, можно отбросить первые два наименьших узла
        end=[combFreq,leastTwo]; // в end записываем сумму двух узлов и сами узлы
        tuples.push(end); // добавляем в конец 'end'
        tuples.sort(); // сортим по возрастанию
    }
    return tuples[0][1]; //выводим только буквы в формате дерева (фано + наименьший вес строки при кодировке)

}

function assignCode(node,pat) // в аргументы функции подаётся массив букв ([ 'e', [ [ 'q', 'r' ], 'w' ] ]) и пустая строка
{
    if(typeof(node)==typeof(""))
        // ^ если нам попалась буква, а не массив
    {
        code[node] = pat;
        // ^ возвращаем в объект букву и соответствующий ей двузначный код
    }
    else
    {
        assignCode( node[0], pat+'0'); // Для обхода левого узла будет отображаться «0»
        // ^ присваеваем левому элементу (массив\буква) 0
        assignCode( node[1], pat+'1'); // Для обхода правого узла — «1»
        // ^ присваеваем правому элементу (массив\буква) 1
    }
}
// ^ с помощью этой рекурсии получаем коды, соответствующие буквам и их частоте

function encode(string)
{
    output='';
    for(s in string)
        output+=code[string[s]];
    return output;
}
// ^ исходя из полученных кодов - склеиваем их в двоичную запись входной строки

function decode(codes, text) { // функции подаётся массив массивов формата ['код' , 'буква'] и двоичное сообщение
    let code = ""; // подстрока, которая копится
    let result = ""; // конечная строка

    for (let i = 0; i <= text.length; i++) {
        if (codes.get(code)){ // если нашёлся такой код из таблицы
            result += codes.get(code); //записываем соответствующю ему букву в результат
            code = text[i];} //собираем следующий код
        else
            code = code + text[i]; // иначе наращиваем, прибавляем ещё цифру
    }
//codes - словарь, get получает элемент с ключом code.
//я иду по циклу: в "code" складываю очередной символ, если code оказался в словаре (get возвращает undefined,
//если элемента нет в словаре), то я просто продолжаю наращивать code. если нашелся, то code обнуляю,
//а в result кладу значение из словаря
    if (code !== undefined && code.length !== 0)
        console.log("Cannot code text with", codes); //если в подстроке что-то остаётся, то декодировать невозможно, пишем ошибку
    return result;
}


if (arg[2] === "code"){

    let fileContent;

    fs.readFile(arg[3], (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        fileContent = data.toString();

        var tuples = (sorted(makingarray(count(fileContent))))

        tree = buildTree(tuples); // в tree сейчас лежит [ 'e', [ [ 'q', 'r' ], 'w' ] ]

        code = {};
        pat = '';

        assignCode(tree, pat); // получаем коды в соответсвие к буквам и их частоте встречаемости

        code1 = Object.entries(code).map((val) => val.join(": ")).join("\n") //делаем массив, получаем формат "ключ": значение

        fs.writeFileSync(arg[4], code1, "ascii") // записываем в таблицу

        encoded = encode(fileContent); //исходя из полученных кодов - склеиваем их в двоичную запись входной строки

        console.log("String: ", fileContent)
        console.log("Coded as: ", encoded)

        fs.writeFileSync(arg[5], encoded, "ascii") // записываем в output
    });
}
else if (arg[2] === "decode"){
    let encoded;
    let table;

    fs.readFile(arg[3], (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        encoded = data.toString();

        fs.readFile(arg[4], (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            table = data.toString();


            var tuples = table.split("\n").map((val) => val.split(": ").reverse());
//   ^ прочитали из таблицы данные и записали в массив массивов формата ['код' , 'буква']
            var stroka = decode(new Map(tuples), encoded);

            console.log("Code: ", encoded)
            console.log("Decoded as: ", stroka)


            fs.writeFileSync(arg[5], stroka, "ascii") // записываем в output
        });
    });
}
else
    console.log('error with arguments')

