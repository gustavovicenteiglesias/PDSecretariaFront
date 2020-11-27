import React, { Component, Fragment } from "react";
import { get,put,delet} from "../services/Axios1";

import Busqueda from "./Busqueda";
import Select from "react-select";



// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button, 
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  Label
} from "reactstrap";


let options = [];

class TablesAbono extends React.Component {
    constructor(props)
  {
    super(props)
    this.setModalEditar=this.setModalEditar.bind(this);
    this.setAbono=this.setAbono.bind(this);
    this.setIdDelete=this.setIdDelete.bind(this);
    this.valorSearchEmpresa=this.valorSearchEmpresa.bind(this);
    this.setModalCrear=this.setModalCrear.bind(this);
     this.setEmpresa=this.setEmpresa.bind(this);
    this.setTecnico=this.setTecnico.bind(this);
    this.escuela=[];

    this.state = {
      selectedOption: null,
          listProfesor:[],
          listBusquedaProfesor:[],
          listEscuela:[],
          id:"",
          nombre: "",
          apellido: "",
          legajo: "",
          especialidad: "",
          fechaIngreso: "",
          fecha_nacimiento:"",
          titulo_habilitante:'',
          antiguedad:'',
          escuelas:null,
          idEmpresa:{},
          idTecnico:{},
          modalEditar:false,
          modalEliminar:false,
          editarModal:true,
          modalCrear:false
    }
    
  }
  handleChange = escuelas => {
    this.setState({ escuelas });
    // Option selected: { value: "rojo", label: "rojo" }
    console.log(`Option selected:`, escuelas);
  };
   async setEmpresa(e){

    const id=e.target.value
    console.log(id);
     const elemento = await get('https://secretaria-educacion.herokuapp.com/api/escuela/find/id')
    console.log(elemento);
    if (elemento.success) {
        this.setState(
        {
          escuelas:elemento.data
        }
        )
        console.log(this.state.escuelas)
    }
    else {
      alert("Error server ==>"+JSON.stringify(elemento))
    }
   
  }
    async setTecnico(e){

    //const id=e.target.value
    //console.log(id);
     //const elemento = await tecnicoServices.get(id)
    //console.log(elemento);
    //if (elemento.success) {
      //  this.setState(
      //  {
      //    idTecnico:elemento.data
      //  }
      //  )
      //  console.log(this.state.idTecnico)
   // }
   // else {
  //    alert("Error server ==>"+JSON.stringify(elemento))
  //  }
   
  }

    setAbono(elemento,caso){
           if (caso === 'Editar'){
                this.setState({editarModal:false})
            }else{
                this.setState({editarModal:true})
            }
    this.setState((state) => ({
          selectedOption:elemento.escuelas.map((data)=>{return {value: data.nombre , label: data.nombre , 
            idEscuela:data.idEscuela}}),
          id:elemento.id,
          nombre:elemento.nombre,
          apellido: elemento.apellido,
          legajo: elemento.legajo,
          especialidad: elemento.especialidad,
          fechaIngreso:elemento.fechaIngreso,
          fecha_nacimiento:elemento.fecha_nacimiento,
          escuelas:elemento.escuelas.map((data)=>{return {value: data.nombre , label: data.nombre , 
                    idEscuela:data.idEscuela}}),
                    
          titulo_habilitante:elemento.titulo_habilitante,
          antiguedad:elemento.antiguedad,
          ie:'',
          ide:'',
          busqueda:'',
          modalEditar:true
    }))
     
        
 }

 setModalCrear(){
     this.setState({
          id:"",
          nombre: "",
          apellido: "",
          legajo: "",
          especialidad: "",
          fechaIngreso: "",
          fecha_nacimiento:"",
          escuelas:'',
          titulo_habilitante:'',
          antiguedad:'',
          busqueda:"",
          modalCrear:!this.state.modalCrear,
    });

   }

  setModalEliminar(){
    this.setState({modalEliminar:!this.state.modalEliminar})
  }
  
  setIdDelete(i,id){
      this.setState({
        ie:i,
        ide:id,
        modalEliminar:true
      })
  }

  async resetLista(){

    const res = await get('https://secretaria-educacion.herokuapp.com/api/profesor/all')
    console.log('res');
    console.log(res);
    if (res.success) {
       this.setState({listProfesor:res.list})
       this.filtrarElementos();
    }
    else {
      alert("Error server ==>"+JSON.stringify(res))
    }

  }

  async onClickSave()
  {
    const urlUpdate='https://secretaria-educacion.herokuapp.com/api/profesor/create/';
    let paramUpdate;
      if(this.state.escuelas === null){
        paramUpdate={
          id:0,
          nombre: this.state.nombre,
          apellido: this.state.apellido,
          legajo: this.state.legajo,
          especialidad: this.state.especialidad,
          fechaIngreso: this.state.fechaIngreso,
          fecha_nacimiento:this.state.fecha_nacimiento,
          titulo_habilitante:this.state.titulo_habilitante,
          antiguedad:this.state.antiguedad,
         
        }
      }else{
        
         paramUpdate={
          id:0,
          nombre: this.state.nombre,
          apellido: this.state.apellido,
          legajo: this.state.legajo,
          especialidad: this.state.especialidad,
          fechaIngreso: this.state.fechaIngreso,
          fecha_nacimiento:this.state.fecha_nacimiento,
          titulo_habilitante:this.state.titulo_habilitante,
          antiguedad:this.state.antiguedad,
          escuelas:this.state.escuelas.map((data)=>{return {idEscuela:data.idEscuela,nombre: data.value
            , diegep: data.diegep, suvencion:data.suvencion}}) ,
        }
      }
    await put(urlUpdate,paramUpdate);
    this.setState({modalCrear:false});
    this.resetLista();
    this.filtrarElementos();
  }


  async onClickDelete()
  {
  
   const id=this.state.ide;
    const i=this.state.ie;
    var yes = true;
    console.log(id,i);
    const urlDelete='https://secretaria-educacion.herokuapp.com/api/profesor/delete/'+id;
    if (yes === true){ 
      
      delet(urlDelete)
      
      
        this.resetLista();
        const list =this.state.listBusquedaProfesor
        list.splice(i,1)
         this.setState((state)=>({listBusquedaProfesor:list,
                      modalEliminar:false
        }))
     
    }
  }

  setModalEditar(){

    this.setState({
        modalEditar:!this.state.modalEditar
    })
  };

    async onClickUpdate(){
      const urlUpdate='https://secretaria-educacion.herokuapp.com/api/profesor/create/';
      let paramUpdate;
      if(this.state.escuelas === null){
        paramUpdate={
          id:this.state.id,
          nombre: this.state.nombre,
          apellido: this.state.apellido,
          legajo: this.state.legajo,
          especialidad: this.state.especialidad,
          fechaIngreso: this.state.fechaIngreso,
          fecha_nacimiento:this.state.fecha_nacimiento,
          titulo_habilitante:this.state.titulo_habilitante,
          antiguedad:this.state.antiguedad,
         
        }
      }else{
        
         paramUpdate={
          id:this.state.id,
          nombre: this.state.nombre,
          apellido: this.state.apellido,
          legajo: this.state.legajo,
          especialidad: this.state.especialidad,
          fechaIngreso: this.state.fechaIngreso,
          fecha_nacimiento:this.state.fecha_nacimiento,
          titulo_habilitante:this.state.titulo_habilitante,
          antiguedad:this.state.antiguedad,
          escuelas:this.state.escuelas.map((data)=>{return {idEscuela:data.idEscuela,nombre: data.value
            , diegep: data.diegep, suvencion:data.suvencion}}) ,
        }
      }
     
      await put(urlUpdate,paramUpdate);
     this.setState({modalEditar:false});
       this.resetLista();
        this.filtrarElementos();
   }
    
  

  
  
 async valorSearchEmpresa(emp){
  console.log('emp')
  console.log(emp)
   await this.setState({busqueda:emp})
  // this.setState((state) => ({busqueda:state.busqueda}));
  this.filtrarElementos();
 }

 filtrarElementos=()=>{
   
  const lista=this.state.listProfesor;
  var search=lista.filter(item=>{
    if(item.id.toString().includes(this.state.busqueda)//||
      // item.nombre.includes(this.state.busqueda)//||
       //item.idEmpresa.nombre.includes(this.state.busqueda)||
       //item.idTecnico.nombre.toLowerCase().includes(this.state.busqueda)||
       //item.idTecnico.nombre.includes(this.state.busqueda)
       )
  
            {
              return item
            }
  })
  console.log('busqueda')
    console.log(search)
    this.setState({listBusquedaProfesor:search})
 }
  
  async componentDidMount(){

    this.setState({listBusquedaProfesor:this.state.listProfesor});
    console.log("Mounted List");
    const res = await get('https://secretaria-educacion.herokuapp.com/api/profesor/all')
    console.log(res);
    if (res.success) {
      this.setState({listProfesor:res.list})
    }
    else {
      alert("Error server ==>"+JSON.stringify(res))
    }

  

     console.log("Mounted ListEscuela");
    const res1 = await get('https://secretaria-educacion.herokuapp.com/api/escuela/all')
    console.log(res1);
    if (res1.success) {
      this.setState({listEscuela:res1.list})
      
    }
    else {
      alert("Error server ==>"+JSON.stringify(res))
    }

  /*  console.log("Mounted listTecnico");
    const rest = await tecnicoServices.list()
    console.log(rest);
    if (rest.success) {
      this.setState({listTecnico:rest.list})
    }
    else {
      alert("Error server ==>"+JSON.stringify(rest))
    }*/
 this.setState({listBusquedaProfesor:this.state.listProfesor});
 options=this.state.listEscuela.map((data)=>{return {value: data.nombre , label: data.nombre , 
  idEscuela:data.idEscuela , diegep: data.diegep, suvencion:data.suvencion}})
  
  }

  


  render() 
  {
      
      const editarModal=this.state.editarModal;
       //const nombreEmpresa=this.state.escuelas.nombre;
      //const nombreTecnico=this.state.idTecnico.nombre;
      //const URLactual ="https://radiant-beach-44502.herokuapp.com/";
     // const baseUrl =URLactual+"/api/abono/pdfReport/";
  
    return (
      <>
        
       
                    
        <div className="content">
          <Row>
            <Col md="12">
            
              <Card>
                <CardHeader>
                  
                  <div class="row ">
                  <div class="form-group col-md-4 ">
                  <CardTitle tag="h4">Profesor</CardTitle>
                  </div>
                    <div class="form-group col-md-4 ">
                    <Busqueda searchBusqueda={this.valorSearchEmpresa}/>
                            </div>
                  <div class="form-group col-md-4  ">
                    <Button  onClick={this.setModalCrear}  size="lg">
                    <i class="fas fa-plus" onClick={this.setModalCrear}></i>
                    </Button>
                    </div>
                    </div>
                </CardHeader>
                <CardBody>
                  <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Legajo</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                       
                      </tr>
                    </thead>
                    <tbody>
                      {
              this.state.listBusquedaProfesor.map((data,i)=>{
                return(
                  <tr>
                    <th scope="row">{data.legajo}</th>
                    <td>{data.nombre}</td>
                    <td>{data.apellido}</td>
                    
                    <td>
                           <Button className="btn-icon" color="info" size="sm"
                           onClick={()=>{this.setAbono(data,'Ver')}} 
                        href="#">
                          <i className="fas fa-eye" />
                          </Button>{` `}
                           
                         <Button  className="btn-icon" color="success" size="sm"
                          onClick={()=>{this.setAbono(data,'Editar')}} 
                         >
                          <i className="fas fa-pencil-alt"></i>
                         </Button>{` `}

                          <Button className="btn-icon" color="danger" size="sm" 
                        href="#" onClick={()=>this.setIdDelete(i,data.id)}>
                          <i className="fas fa-trash-alt" />
                          </Button>{'  '}

                          
                      
                    </td>
                  </tr>
                )
              })
            }
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
            
          </Row>
       
          </div>
           <Modal  isOpen={this.state.modalEditar} toggle={this.setModalEditar} size="lg" >
                <div className="modal-header">
                  <h3 className="modal-title" id="exampleModalLabel">
                   Profesor
                  </h3>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-hidden="true"
                    onClick={this.setModalEditar}
                  >
                    <i className="tim-icons icon-simple-remove" />
                  </button>
                </div>
                <ModalBody >
                <div class="border border-info my-2 p-2"> 
                    <div class="row ">
                    <div class="form-group col-md-4  ">
                     <label>Nombre</label>
                      <input
                        className="form-control bg-white text-dark "
                        readOnly={editarModal}
                        type="text"
                        name="nombre"
                        value={this.state.nombre}
                        onChange={(value)=>this.setState({nombre:value.target.value})}
                      /> 
                      </div> 
                    <div class="form-group col-md-4 ">
                     <label>Apellido</label>
                      <input
                        className="form-control bg-white text-dark "
                        readOnly={editarModal}
                        type="text"
                        name="apellido"
                        value={this.state.apellido}
                        onChange={(value)=>this.setState({apellido:value.target.value})}
                      /> 
                      </div> 
                      <div class="form-group col-md-4 ">
                      <label>Cargo</label>
                      <Input
                        className="form-control bg-white text-dark "
                        readOnly={editarModal}
                        type="select"
                        name="especialidad"
                        value={this.state.especialidad}
                        onChange={(value)=>this.setState({especialidad:value.target.value})}
                      > 
                      <option value="Matematicas">Matematicas</option>
                      <option value="Historia">Historia</option>
                      <option value="Arte">Arte</option>
                      </Input>
                      </div>
                    </div> 

                    <div class="row ">
                    <div class="form-group col-md-4 ">
                     <label>Fecha Ingreso</label>
                      <input
                        className="form-control bg-white text-dark "
                        readOnly={editarModal}
                        type="date"
                        name="fechaIngreso"
                        value={this.state.fechaIngreso}
                        onChange={(value)=>this.setState({fechaIngreso:value.target.value})}
                      /> 
                      </div> 
                    <div class="form-group col-md-4 ">
                     <label>Fecha Nacimiento </label>
                      <input
                        className="form-control bg-white text-dark"
                        readOnly={editarModal}
                        type="date"
                        name="fecha_nacimiento"
                        value={this.state.fecha_nacimiento}
                        onChange={(value)=>this.setState({fecha_nacimiento:value.target.value})}
                      /> 
                      </div> 
                      <div class="form-group col-md-4 ">
                      <label>Legajo</label>
                      <input
                        className="form-control bg-white text-dark"
                        readOnly={editarModal}
                        type="number"
                        name="legajo"
                        value={this.state.legajo}
                        onChange={(value)=>this.setState({legajo:value.target.value})}
                      /> 
                      </div>
                    </div> 
                    </div> 
                    <div class="border border-info my-2 p-2"> 
                <div class="row ">
                    <div class="form-group col-md-4 ">
                      <Label for="exampleSelectMulti">Escuelas</Label>
                      <Select
                          readOnly={editarModal}
                          isMulti
                          options={options}
                          value={this.state.escuelas}
                          onChange={this.handleChange}
                          closeMenuOnSelect={false}
                        />
                    </div>
                      <div class="form-group col-md-4 ">
                      <label>Antiguedad</label>
                      <input
                        className="form-control bg-white text-dark"
                        readOnly={editarModal}
                        type="number"
                        name="antiguedad"
                        value={this.state.antiguedad}
                        onChange={(value)=>this.setState({antiguedad:value.target.value})}
                      /> 
                      </div>
                      <div class="form-group col-md-4 ">
                      <label>Titulo Habilitante</label>
                      <Input
                        className="form-control bg-white text-dark "
                        readOnly={editarModal}
                        type="select"
                        name="titulo_habilitante"
                        value={this.state.titulo_habilitante}
                        onChange={(value)=>this.setState({titulo_habilitante:value.target.value})}
                      > 
                      <option value="Si">Si</option>
                      <option value="No">No</option>
                      
                      </Input>
                      </div>
                    </div> 
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.setModalEditar}>
                        Cerrar
                    </Button>
                    <Button color="warning" disabled={editarModal} 
                    onClick={()=>this.onClickUpdate()}>
                        Update
                    </Button>
                   
                </ModalFooter>
            </Modal> 
            <Modal isOpen={this.state.modalEliminar} toggle={this.setModalEliminar}>
                <ModalBody>
                  Estás Seguro que deseas eliminar Abono
                </ModalBody>
                <ModalFooter>
                  <button className="btn btn-danger" onClick={()=>this.onClickDelete()}>
                    Sí
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={()=>{this.setState({modalEliminar:false})}}
                  >
                    No
                  </button>
                </ModalFooter>
              </Modal>

              <Modal  isOpen={this.state.modalCrear} toggle={this.setModalCrear} size="lg" >
                <div className="modal-header">
                  <h3 className="modal-title" id="exampleModalLabel">
                   Profesor
                  </h3>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-hidden="true"
                    onClick={this.setModalCrear}
                  >
                    <i className="tim-icons icon-simple-remove" />
                  </button>
                </div>
                <ModalBody >
                <div class="border border-info my-2 p-2"> 
                    <div class="row ">
                    <div class="form-group col-md-4  ">
                     <label>Nombre</label>
                      <input
                        className="form-control bg-white text-dark "
                        
                        type="text"
                        name="nombre"
                        value={this.state.nombre}
                        onChange={(value)=>this.setState({nombre:value.target.value})}
                      /> 
                      </div> 
                    <div class="form-group col-md-4 ">
                     <label>Apellido</label>
                      <input
                        className="form-control bg-white text-dark "
                       
                        type="text"
                        name="apellido"
                        value={this.state.apellido}
                        onChange={(value)=>this.setState({apellido:value.target.value})}
                      /> 
                      </div> 
                      <div class="form-group col-md-4 ">
                      <label>Cargo</label>
                      <Input
                        className="form-control bg-white text-dark "
                        
                        type="select"
                        name="especialidad"
                        value={this.state.especialidad}
                        onChange={(value)=>this.setState({especialidad:value.target.value})}
                      > 
                      <option value="Matematicas">Matematicas</option>
                      <option value="Historia">Historia</option>
                      <option value="Arte">Arte</option>
                      </Input>
                      </div>
                    </div> 

                    <div class="row ">
                    <div class="form-group col-md-4 ">
                     <label>Fecha Ingreso</label>
                      <input
                        className="form-control bg-white text-dark "
                        
                        type="date"
                        name="fechaIngreso"
                        value={this.state.fechaIngreso}
                        onChange={(value)=>this.setState({fechaIngreso:value.target.value})}
                      /> 
                      </div> 
                    <div class="form-group col-md-4 ">
                     <label>Fecha Nacimiento </label>
                      <input
                        className="form-control bg-white text-dark"
                        
                        type="date"
                        name="fecha_nacimiento"
                        value={this.state.fecha_nacimiento}
                        onChange={(value)=>this.setState({fecha_nacimiento:value.target.value})}
                      /> 
                      </div> 
                      <div class="form-group col-md-4 ">
                      <label>Legajo</label>
                      <input
                        className="form-control bg-white text-dark"
                       
                        type="number"
                        name="legajo"
                        value={this.state.legajo}
                        onChange={(value)=>this.setState({legajo:value.target.value})}
                      /> 
                      </div>
                    </div> 
                    </div> 
                    <div class="border border-info my-2 p-2"> 
                <div class="row ">
                    <div class="form-group col-md-4 ">
                      <Label for="exampleSelectMulti">Escuelas</Label>
                      <Select
                          isMulti
                          options={options}
                          value={this.state.escuelas}
                          onChange={this.handleChange}
                          closeMenuOnSelect={false}
                        />
                    </div>
                      <div class="form-group col-md-4 ">
                      <label>Antiguedad</label>
                      <input
                        className="form-control bg-white text-dark"
                      
                        type="number"
                        name="antiguedad"
                        value={this.state.antiguedad}
                        onChange={(value)=>this.setState({antiguedad:value.target.value})}
                      /> 
                      </div>
                      <div class="form-group col-md-4 ">
                      <label>Titulo Habilitante</label>
                      <Input
                        className="form-control bg-white text-dark "
                        
                        type="select"
                        name="titulo_habilitante"
                        value={this.state.titulo_habilitante}
                        onChange={(value)=>this.setState({titulo_habilitante:value.target.value})}
                      > 
                      <option value="Si">Si</option>
                      <option value="No">No</option>
                      
                      </Input>
                      </div>
                    </div> 
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.setModalCrear}>
                        Cerrar
                    </Button>
                    <Button color="warning" 
                    onClick={()=>this.onClickSave()}>
                        Guardar
                    </Button>
                   
                </ModalFooter>
            </Modal> 
          </>
    )
  }
  }

export default TablesAbono;