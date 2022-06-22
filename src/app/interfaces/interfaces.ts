export interface User {
    avatar?: string;
    _id?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: string
}


export interface Cliente {
    nombres?: string,
    apellidos?: string,
    identificacion?: number,
    direccion?: string,
    celular?: number,
    email?: string
    _id?: string
}

export interface Venta {
    _id?: string,
    productos?: any[],
    cliente_id?: string,
    observacion?: string,
    subtotal?: number,
    mesa?: string,
    total?: number,
    recibe_dinero?: string,
    devolucion_dinero?: string,
    user_id?: string,
    cliente?: any
}


export interface Categoria {
    nombre?: string,
    estado?: string,
    _id?: string
}

export interface Bodega {
    created_at?: string,
    nombre?: string,
    estado?: string,
    _id?: string
}

export interface Proveedor {
    nombre?: string,
    celular?: string,
    ruc?: string,
    direccion?: string,
    email?: string,
    user_id?: string,
    estado?: string,
    _id?: string
}


export interface ItemIngreso {
    codigo_item?: string,
    descripcion?: string,
    valor_unitario?: number,
    cantidad?: number,
    total?: number,
    _id?: string
}


export interface BodegaIngreso {
    bodega_id?: { nombre?: string },
    observacion?: string,
    proveedor_id?: { nombre?: string },
    fecha_ingreso?: string,
    items: [{
        producto_id: string,
        codigo: string,
        descripcion: string,
        cantidad: number,
        valor_unitario: number,
        total: number
    }],
    user_id?: string,
    estado?: string,
    created_at?: string,
    updated_at?: string
}



export interface Producto {
    _id: string,
    nombre: string,
    codigo: string,
    categoria_id: string,
    proveedor_id: string,
    precio: string,
    estado?: string,
    image: string
}