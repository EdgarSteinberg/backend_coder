function changeRole(userId, newRole) {
    fetch(`/api/users/premium/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
    })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    title: 'Rol actualizado con éxito.',
                    icon: 'success',
                    showConfirmButton: true
                }).then(() => {
                    window.location.reload();
                });
            } else {
                return response.json().then(data => {
                    Swal.fire({
                        title: `Error: ${data.error}`,
                        icon: 'info',
                        showConfirmButton: true
                    })
                });
            }
        })
        .catch(error => {
            console.error('Error al actualizar el rol:', error);
            alert('Error al actualizar el rol.');
        });
}

function deleteUser(userId) {
    fetch(`/api/users/${userId}`, {
        method: 'DELETE',
    })
        .then(res => {
            if (res.ok) {
                Swal.fire({
                    title: 'Usuario Eliminado.',
                    icon: 'success',
                    showConfirmButton: true
                }).then(() => {
                    window.location.reload();
                });
            } else {
                return res.json().then(data => {
                    alert(`Error: ${data.error || 'No se pudo eliminar el usuario.'}`);
                });
            }
        })
        .catch(error => {
            console.error('Error al eliminar el usuario:', error);
            alert('Error al eliminar el usuario.');
        })
}

function deleteUsers() {
    fetch('/api/users', {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                if (data.message === 'No hay usuarios inactivos') {
                    //alert('No hay usuarios inactivos para eliminar.');
                    Swal.fire({
                        title: 'No hay usuarios inactivos para eliminar.',
                        icon: 'info',
                        showConfirmButton: true
                    }).then(() => {
                        window.location.reload()
                    })
                } else {
                    Swal.fire({
                        title: 'Usuarios Eliminados con exito.',
                        icon: 'success',
                        showConfirmButton: true
                    }).then(() => {
                        window.location.reload()
                    })
                }
            } else {
                alert(`Error: ${data.message || 'Error al eliminar los usuarios'}`);
            }
            //window.location.reload(); // Recargar la página para reflejar los cambios
        })
        .catch(error => {
            console.error('Error al eliminar los usuarios:', error);
            alert('Error al eliminar los usuarios.');
        });
}
