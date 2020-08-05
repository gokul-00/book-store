const express = require('express')
const router = express.Router()
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth')

const Project = require('../models/Project')

//All books route
router.get('/', async (req,res) => {
  let query = Project.find();
  if(req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  // if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
  //   query = query.lte('publishDate', req.query.publishedBefore)
  // }
  // if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
  //   query = query.gte('publishDate', req.query.publishedAfter)
  // }
  try {
    const projects = await query.exec()
    res.render('projects/index',{
      projects:projects,
      searchOptions:req.query
   })
  } catch (error) {
    res.redirect('/',{
      errMsg:error._message
    })
  }
  
})

//new Book route
router.get('/new',ensureAuthenticated,async (req,res)=>{
  renderFormPage(res,new Project(),'new', true)
})

//create Book Route
router.post('/', async (req, res) => {
  const project = new Project({
    title: req.body.title,
    projectEstimate: req.body.projectEstimate,
    description: req.body.description
  })

  try {
    await project.save()
    res.redirect(`projects/${project.id}`)
    
  
  } catch {
    renderFormPage(res, project,'new', true)
  }
})

router.get('/:id',async (req,res)=>{
  try {
    const project = await Project.findById(req.params.id).populate('author').exec()
    res.render('projects/show',{project:project})
  } catch (error) {
    res.redirect('/')
  }
})

//edit book route
router.get('/edit/:id', async(req,res)=>{
  try {
    const project = await Project.findById(req.params.id)
    renderFormPage(res, project, 'edit', true)
  } catch (error) {
    res.redirect('/')
  }
  
})

//update book route
router.put('/:id', async (req, res) => {
  let project ;
  try {
    project = await Project.findById(req.params.id)
    project.title =  req.body.title,
    project.projectEstimate = req.body.projectEstimate,
    project.description = req.body.description
    await project.save()
    res.redirect(`/projects/${project.id}`)
  } catch {
    if(project != null){
      renderFormPage(res, project,'edit', true)
    }else{
      res.redirect('/')
    }
    
  }
})

router.delete('/:id',async(req,res)=>{
  let project
  try {
    project = await Project.findById(req.params.id)
    await project.remove()
    res.redirect('/projects')
  } catch (error) {
    if(project != null) {
      res.render('projects/show',{
        project:project,
        errMsg: 'could not remove post'
      })
    }else{
      res.redirect('/')
    }
  }
})


async function renderFormPage(res, project, form, hasError = false) {
  try {
    const params = {
      project: project
    }
    res.render(`projects/${form}`, params)
    
  } catch(err) {
    res.redirect('/projects',{
      errMsg : `error on ${form}`
    })
  }
}


module.exports = router