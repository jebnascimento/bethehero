const connection = require('../database/connection')

module.exports = {

  async index (request, response)
  {
    const { page = 1 } = request.query;//se page não existir, page = 1
    
    const [count] = await connection('incidents').count();
    console.log(count);

    //paginação
    const incidents = await connection('incidents')
      .join('ongs', 'ongs.id', '=', 'incidents.ong_id')//relaciona dados de 2 tabelas. 
      .limit(5)//limita a busca no banco de dados para 5
      .offset((page - 1) * 5)//na pagina 1 ele pega os 5 primeiros registros, na pagina 2 ele pega do 6º até o décimo inclusive.
      .select(['incidents.*', 
      'ongs.name', 
      'ongs.email', 
      'ongs.whatsapp', //quero todos os dados do incidente, porén quero alguns dados de ongs.
      'ongs.city', 
      'ongs.uf']); 

    response.header('X-Total-Count', count['count(*)']);//retorna o número total de incidentes

    return response.json(incidents);
  },

  async create(request, response){
    const {title, description, value} = request.body;
    const ong_id = request.headers.authorization;

    const [id] = await connection('incidents').insert({
      title,
      description,
      value,
      ong_id,
    })

    return response.json({ id });
  },

  async delete(request, response){
    const { id } = request.params;
    const ong_id = request.headers.authorization;

    const incident = await connection('incidents')
      .where('id', id)
      .select('ong_id')
      .first();

      if(incident.ong_id != ong_id){
        return response.status(401).json({error: 'Operation not permitted.'});
      }

      await connection('incidents').where('id', id).delete();
      return response.status(204).send();
  }
};