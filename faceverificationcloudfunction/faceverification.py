import face_recognition


def sameface(filepath1,filepath2):
    image_1 = face_recognition.load_image_file(filepath1)
    image_2 = face_recognition.load_image_file(filepath2)

    encoding_1 = face_recognition.face_encodings(image_1)[0]
    encoding_2 = face_recognition.face_encodings(image_2)[0]
    results = face_recognition.compare_faces([encoding_1], encoding_2)
    return results


if sameface("fdfasd-original.jpg","fdfasd-verify.jpg")[0] == True:
    print("hello")
