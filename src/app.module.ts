import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AuditLogInterceptor } from './audit-log/audit-log.interceptor';
import { PrismaModule } from './prisma/prisma.module';
import { AuditLogsModule } from './admin/audit-logs/audit-logs.module';
import { PartenairesModule } from './admin/partenaires/partenaires.module';
import { UtilisateursModule } from './admin/utilisateurs/utilisateurs.module';
import { CategoriesModule } from './admin/categories/categories.module';
import { ActualitesModule } from './admin/actualites/actualites.module';
import { AgendaModule } from './admin/agenda/agenda.module';
import { TableOrgModule } from './admin/table-org/table-org.module';
import { DocumentsModule } from './admin/documents/documents.module';
import { ActesOiaModule } from './admin/actes-oia/actes-oia.module';
import { ProjetsModule } from './admin/projets/projets.module';
import { PhotoAlbumsModule } from './admin/photo-albums/photo-albums.module';
import { VideosModule } from './admin/videos/videos.module';
import { PressBookModule } from './admin/press-book/press-book.module';
import { CampagnesModule } from './admin/campagnes/campagnes.module';
import { PrixTendanceModule } from './admin/prix-tendance/prix-tendance.module';
import { RevuePresseModule } from './admin/revue-presse/revue-presse.module';
import { TextesDefilantsModule } from './admin/textes-defilants/textes-defilants.module';
import { ContactModule } from './contact/contact.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { MediaModule } from './media/media.module';
import { PublicModule } from './public/public.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 120 }],
    }),
    PrismaModule,
    AuditLogModule,
    AuthModule,
    PartenairesModule,
    UtilisateursModule,
    CategoriesModule,
    ActualitesModule,
    AgendaModule,
    TableOrgModule,
    DocumentsModule,
    ActesOiaModule,
    ProjetsModule,
    PhotoAlbumsModule,
    VideosModule,
    PressBookModule,
    CampagnesModule,
    PrixTendanceModule,
    RevuePresseModule,
    TextesDefilantsModule,
    ContactModule,
    SiteSettingsModule,
    MediaModule,
    AuditLogsModule,
    PublicModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
})
export class AppModule {}
