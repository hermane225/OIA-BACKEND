import { Module } from '@nestjs/common';
import { ActualitesModule } from '../admin/actualites/actualites.module';
import { AgendaModule } from '../admin/agenda/agenda.module';
import { CategoriesModule } from '../admin/categories/categories.module';
import { PartenairesModule } from '../admin/partenaires/partenaires.module';
import { DocumentsModule } from '../admin/documents/documents.module';
import { ActesOiaModule } from '../admin/actes-oia/actes-oia.module';
import { ProjetsModule } from '../admin/projets/projets.module';
import { PhotoAlbumsModule } from '../admin/photo-albums/photo-albums.module';
import { VideosModule } from '../admin/videos/videos.module';
import { PressBookModule } from '../admin/press-book/press-book.module';
import { CampagnesModule } from '../admin/campagnes/campagnes.module';
import { PrixTendanceModule } from '../admin/prix-tendance/prix-tendance.module';
import { RevuePresseModule } from '../admin/revue-presse/revue-presse.module';
import { PublicContentController } from './public-content.controller';

@Module({
  imports: [
    ActualitesModule,
    AgendaModule,
    CategoriesModule,
    PartenairesModule,
    DocumentsModule,
    ActesOiaModule,
    ProjetsModule,
    PhotoAlbumsModule,
    VideosModule,
    PressBookModule,
    CampagnesModule,
    PrixTendanceModule,
    RevuePresseModule,
  ],
  controllers: [PublicContentController],
})
export class PublicModule {}
