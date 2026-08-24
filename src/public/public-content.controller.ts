import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { StatutPublication } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';
import { ActualitesService } from '../admin/actualites/actualites.service';
import { AgendaService } from '../admin/agenda/agenda.service';
import { CategoriesService } from '../admin/categories/categories.service';
import { PartenairesService } from '../admin/partenaires/partenaires.service';
import { DocumentsService } from '../admin/documents/documents.service';
import { ActesOiaService } from '../admin/actes-oia/actes-oia.service';
import { ProjetsService } from '../admin/projets/projets.service';
import { PhotoAlbumsService } from '../admin/photo-albums/photo-albums.service';
import { VideosService } from '../admin/videos/videos.service';
import { PressBookService } from '../admin/press-book/press-book.service';
import { CampagnesService } from '../admin/campagnes/campagnes.service';
import { PrixTendanceService } from '../admin/prix-tendance/prix-tendance.service';
import { RevuePresseService } from '../admin/revue-presse/revue-presse.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Public')
@Public()
@Controller()
export class PublicContentController {
  constructor(
    private readonly actualitesService: ActualitesService,
    private readonly agendaService: AgendaService,
    private readonly categoriesService: CategoriesService,
    private readonly partenairesService: PartenairesService,
    private readonly documentsService: DocumentsService,
    private readonly actesOiaService: ActesOiaService,
    private readonly projetsService: ProjetsService,
    private readonly photoAlbumsService: PhotoAlbumsService,
    private readonly videosService: VideosService,
    private readonly pressBookService: PressBookService,
    private readonly campagnesService: CampagnesService,
    private readonly prixTendanceService: PrixTendanceService,
    private readonly revuePresseService: RevuePresseService,
  ) {}

  @Get('actualites')
  findPublishedActualites(
    @Query('categorieId') categorieId?: string,
    @Query('search') search?: string,
  ) {
    return this.actualitesService.findAll({
      categorieId,
      search,
      statut: StatutPublication.publie,
    });
  }

  @Get('actualites/:slug')
  findOneActualite(@Param('slug') slug: string) {
    return this.actualitesService.findPublishedBySlug(slug);
  }

  @Get('agenda')
  findPublishedAgenda(@Query('search') search?: string) {
    return this.agendaService.findAll({
      search,
      statut: StatutPublication.publie,
    });
  }

  @Get('agenda/:id')
  findOneAgenda(@Param('id', ParseIntPipe) id: number) {
    return this.agendaService.findPublishedOne(id);
  }

  @Get('categories')
  findCategories() {
    return this.categoriesService.findAll();
  }

  @Get('partenaires')
  findPartenaires(@Query('type') type?: string) {
    return this.partenairesService.findAll({ type });
  }

  @Get('documents')
  findPublishedDocuments() {
    return this.documentsService.findAllPublished();
  }

  @Get('actes-oia')
  findPublishedActes() {
    return this.actesOiaService.findAllPublished();
  }

  @Get('projets')
  findPublishedProjets() {
    return this.projetsService.findAllPublished();
  }

  @Get('photo-albums')
  findPublishedPhotoAlbums() {
    return this.photoAlbumsService.findAllPublished();
  }

  @Get('photo-albums/:id')
  findOnePhotoAlbum(@Param('id', ParseIntPipe) id: number) {
    return this.photoAlbumsService.findOne(id);
  }

  @Get('videos')
  findPublishedVideos() {
    return this.videosService.findAllPublished();
  }

  @Get('press-book')
  findPublishedPressBook() {
    return this.pressBookService.findAllPublished();
  }

  @Get('press-book/:id')
  findOnePressBook(@Param('id', ParseIntPipe) id: number) {
    return this.pressBookService.findOne(id);
  }

  @Get('revue-presse')
  findPublishedRevuePresse() {
    return this.revuePresseService.findAllPublished();
  }

  @Get('campagnes')
  findCampagnes() {
    return this.campagnesService.findAll();
  }

  @Get('campagnes/:id')
  findOneCampagne(@Param('id', ParseIntPipe) id: number) {
    return this.campagnesService.findOne(id);
  }

  @Get('prix-tendance')
  findPrixTendance() {
    return this.prixTendanceService.findAll();
  }

  @Get('prix-tendance/:id')
  findOnePrixTendance(@Param('id', ParseIntPipe) id: number) {
    return this.prixTendanceService.findOne(id);
  }
}
