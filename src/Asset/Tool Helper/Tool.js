const InspectFormData = (formData) => {
    for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
    }
}

const GetRemainingImage = (fileList) => {
    const newFile = fileList.filter(item => item.uid < 0).map(item => item.url)
    return newFile.length > 0 ? newFile : null;
}

const ConvertObjectToFormData = (Data) => {
    const formData = new FormData();
    Object.keys(Data).forEach((key) => {
        if (Array.isArray(Data[key])) {
            Data[key].forEach((item,index) => {
                if (typeof item === 'object') {
                    Object.keys(item).forEach(Childkey => {
                        formData.append(key + '[' + index + '].' + Childkey, item[Childkey]);
                    })
                } else {
                    formData.append(key, item);
                }
            })
        }
        else {
            formData.append(key, Data[key]);
        }
    })
    return formData;
};

const ConvertImageAntdToOrigin = (Files) => {
    const files = Files.map((items) => {
        return items.originFileObj;
    })
    return files;
}
const getSizeAndQuantity = (sizeAndQuantities) => {
    const files = sizeAndQuantities.map((item) => {
        return {
            Size: item.Size,
            Quantity: item.Quantity
        };
    })
    return files;
}

const InsertArrayIntoFormData = (Data, Obj, Name) => {
    Data.delete(Name);
    Obj.forEach((item) => {
        Data.append(Name, item);
    })
    return Data;
}

const InsertArrayObjectIntoFormData = (FormData, Obj, Name) => {
    FormData.delete(Name);
    Obj.forEach((item, index) => {
        Object.keys(item).forEach(key => {
            FormData.append(Name + '[' + index + '].' + key, item[key]);
        })
    })
    return FormData;
}

const GetSelected = (item) => {
    return item.split('/')[0];
}

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export { GetRemainingImage, InspectFormData, InsertArrayIntoFormData, GetSelected, InsertArrayObjectIntoFormData, ConvertObjectToFormData, ConvertImageAntdToOrigin, getBase64, getSizeAndQuantity };