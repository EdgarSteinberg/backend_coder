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
                alert('Rol actualizado con éxito.');
                window.location.reload(); // Recargar la página para ver los cambios
            } else {
                return response.json().then(data => {
                    alert(`Error: ${data.error}`);
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
                alert('Usuario Eliminado.');
                window.location.reload();
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
        .then(res => res.json()) // Parsear la respuesta JSON
        .then(data => {
            if (data.status === 'success') {
                if (data.message === 'No hay usuarios inactivos') {
                    alert('No hay usuarios inactivos para eliminar.');
                } else {
                    alert('Usuarios Eliminados.');
                }
            } else {
                alert(`Error: ${data.message || 'Error al eliminar los usuarios'}`);
            }
            window.location.reload(); // Recargar la página para reflejar los cambios
        })
        .catch(error => {
            console.error('Error al eliminar los usuarios:', error);
            alert('Error al eliminar los usuarios.');
        });
}
