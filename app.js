
function handleFileSelect() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    if (file && file.name.endsWith('.csv')) {
        processData(file);
        showDataViewScreen();
    } else {
        alert('Неподдерживаемый формат файла. Разрешены только файлы .CSV.');
    }
}

    function handleButtonClick() {
    const fileInput = document.getElementById('file-input');
    fileInput.click();}

  

    // Очищаем выбранный файл, чтобы событие срабатывало при последующих выборах того же файла
    fileInput.value = '';
      
        function showDataViewScreen() {
            document.getElementById('main-screen').classList.add('hidden');
            document.getElementById('data-view-screen').classList.remove('hidden');
        }

        function loadNewFile() {
            localStorage.removeItem('csvData');
            document.getElementById('main-screen').classList.remove('hidden');
            document.getElementById('data-view-screen').classList.add('hidden');
        }

        function processData(file) {
            const reader = new FileReader();
        
            reader.onload = function (event) {
                const csvData = event.target.result;
                const rows = csvData.split(/\r\n|\n/);
        
                // Обработка BOM, если он присутствует
                const hasBOM = csvData.charCodeAt(0) === 0xFEFF;
                const startRow = hasBOM ? 1 : 0;
        
                const headers = rows[startRow].split(',');
        
                // Сопоставление полей в CSV и таблице
                const fieldMappings = {
                    'name': 'Имя',
                    'phone': 'Номер телефона',
                    'email': 'email',
                    'bday': 'Дата рождения',
                    'address': 'Адрес'
                };
        
                clearTable();
        
                const headerRow = document.createElement('tr');
                headers.forEach(headerText => {
                    const th = document.createElement('th');
                    th.textContent = fieldMappings[headerText] || headerText;
                    headerRow.appendChild(th);
                });
                document.getElementById('data-table').appendChild(headerRow);
        
                for (let i = startRow + 1; i < rows.length; i++) {
                    const rowData = rows[i].split(',');
                    const row = document.createElement('tr');
                    rowData.forEach(cellData => {
                        const td = document.createElement('td');
                        td.textContent = cellData;
                        row.appendChild(td);
                    });
                    document.getElementById('data-table').appendChild(row);
                }
        
                localStorage.setItem('csvData', JSON.stringify(csvData));
            };
        
            // Указываем кодировку "utf-8"
            reader.readAsText(file, 'utf-8');
        }


        function clearTable() {
            const dataTable = document.getElementById('data-table');
            while (dataTable.firstChild) {
                dataTable.removeChild(dataTable.firstChild);
            }
        }

        // При загрузке страницы проверяем наличие сохраненных данных
        window.onload = function () {
            const savedData = localStorage.getItem('csvData');
            if (savedData) {
                // Если данные сохранены, отображаем сразу экран с таблицей
                showDataViewScreen();
                // И заполняем таблицу сохраненными данными
                processData(new Blob([savedData]));
            }
        };

        function showDataViewScreen() {
            document.getElementById('main-screen').classList.add('hidden');
            document.getElementById('data-view-screen').classList.remove('hidden');
        
            // Закрываем модальное окно загрузки 
            const loadingModal = document.getElementById('main-screen');
            if (loadingModal) {
                loadingModal.style.display = 'none';
            }
        }